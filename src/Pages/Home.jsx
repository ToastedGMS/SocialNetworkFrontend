import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import { useQuery } from '@tanstack/react-query';
import PostContext from '../Context/postContext';
import ProfileContext from '../Context/profileContext';
import Post from '../Reusable/Post';
import NewContent from '../Reusable/NewContent';
import { SocketContext } from '../Context/socketContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Home() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const { setPostVal } = useContext(PostContext);
	const { setProfile } = useContext(ProfileContext);
	const { socket } = useContext(SocketContext);
	const [message, setMessage] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser?.user?.id) {
			setError('Please login first.');
			navigate('/login');
			return;
		}

		socket.connect();

		socket.emit('register_user', currentUser.user.id);

		socket.on('welcome', (message) => {
			console.log(message);
		});

		socket.on('like_notification', ({ sender, post }) => {
			setMessage(`User ${sender} liked your post of ID ${post}`);
		});

		socket.on('unread_notifications', (notifications) => {
			if (notifications.length > 0) {
				console.log(`You have ${notifications.length} unread notifications!`);
			}
		});

		return () => {
			socket.disconnect();
			socket.off('welcome');
		};
	}, [currentUser, setError, navigate, socket]);

	const generateFeed = async () => {
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

	if (isLoading) return <p>Loading...</p>;
	if (error) {
		setError(error.message);
		return (
			<>
				<NewContent currentUser={currentUser} postID={null} dataType={'post'} />

				<p>Error: {error.message}</p>
			</>
		);
	}

	return (
		<>
			<NewContent currentUser={currentUser} postID={null} dataType={'post'} />
			{message && <p>{message}</p>}
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
						/>
					))
				) : (
					<p>Add some friends to start seeing posts!</p>
				)}
			</div>
		</>
	);
}
