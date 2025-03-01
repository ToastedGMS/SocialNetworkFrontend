import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PostContext from '../Context/postContext';
import ProfileContext from '../Context/profileContext';
import Post from '../Reusable/Post';
import NewContent from '../Reusable/NewContent';
import { SocketContext } from '../Context/socketContext';
import NotificationContext from '../Context/notificationContext';
import GuestContext from '../Context/guestContext';
import guestPosts from '../guestPosts';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Home() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const { setPostVal } = useContext(PostContext);
	const { setProfile } = useContext(ProfileContext);
	const { socket } = useContext(SocketContext);
	const { setNotifs } = useContext(NotificationContext);
	const [message, setMessage] = useState(null);
	const { isGuest } = useContext(GuestContext);

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!currentUser?.user?.id) {
			setError('Please login first.');
			navigate('/login');
			return;
		}

		socket.connect();

		socket.emit('register_user', currentUser.user.id);

		socket.on('like_notification', ({ sender, post }) => {
			setMessage(`User ${sender} liked your post of ID ${post}`);
		});

		socket.on('unread_notifications', (notifications) => {
			setNotifs(notifications);
		});

		socket.on('new_post', () => {
			queryClient.invalidateQueries(['posts']);
		});

		return () => {
			socket.disconnect();
			socket.off('welcome');
		};
	}, [currentUser, setError, navigate, socket]);

	const generateFeed = async () => {
		if (isGuest) {
			return guestPosts;
		}
		const response = await fetch(
			`${serverUrl}/api/posts/feed/${currentUser.user.id}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.error || 'Error fetching posts');
		}

		const res = await response.json();
		return res;
	};

	const { data, error, isLoading } = useQuery({
		queryKey: ['posts'],
		queryFn: generateFeed,
	});

	if (isLoading) return <p style={{ color: 'white' }}>Loading...</p>;
	if (error) {
		setError(error.message);
		return (
			<>
				<NewContent
					currentUser={currentUser}
					postID={null}
					dataType={'post'}
					isGuest={isGuest}
				/>

				<p style={{ color: 'white' }}>Error: {error.message}</p>
			</>
		);
	}

	return (
		<>
			<NewContent
				currentUser={currentUser}
				postID={null}
				dataType={'post'}
				isGuest={isGuest}
			/>
			<div>
				{data && data.length !== 0 ? (
					data.map((post) => (
						<Post
							setProfile={setProfile}
							data={post}
							currentUser={currentUser}
							setPostVal={setPostVal}
							key={post.id}
							profileClick={true}
							socket={socket}
							isGuest={isGuest}
						/>
					))
				) : (
					<p style={{ color: 'white', fontSize: '2em', fontWeight: 'bold' }}>
						Add some friends to start seeing posts!
					</p>
				)}
			</div>
		</>
	);
}
