import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import ProfileContext from '../Context/profileContext';
import UserContext from '../Context/userContext';
import PostContext from '../Context/postContext';
import { useQuery } from '@tanstack/react-query';
import Post from '../Reusable/Post';
import FriendBtn from '../Reusable/FriendBtn';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Profile() {
	const { setError } = useContext(ErrorContext);
	const { currentUser } = useContext(UserContext);
	const { profile } = useContext(ProfileContext);
	const { setPostVal } = useContext(PostContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === undefined) return;

		if (currentUser === null) {
			setError('Please login first.');
			navigate('/login');
		}
	}, [currentUser, navigate, setError]);

	const [friendStatus, setFriendStatus] = useState(null);

	async function friendshipStatus() {
		try {
			const senderId = currentUser?.user?.id;
			const receiverId = profile?.id;

			if (!senderId || !receiverId) return;

			// Check friendship status (sender -> receiver)
			const responseSender = await fetch(
				`${serverUrl}/api/friendships/status?senderId=${senderId}&receiverId=${receiverId}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);

			if (responseSender.ok) {
				const res = await responseSender.json();
				setFriendStatus(res.status);
				return;
			}

			// If not found, check friendship in reverse (receiver -> sender)
			const responseReceiver = await fetch(
				`${serverUrl}/api/friendships/status?senderId=${receiverId}&receiverId=${senderId}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);

			if (responseReceiver.ok) {
				const res = await responseReceiver.json();
				setFriendStatus(res.status);
				return;
			}

			// If no friendship exists, set status to null
			setFriendStatus(null);
		} catch (error) {
			console.error('Failed to check friendship status:', error);
			setFriendStatus(null); // Assume no friendship in case of error
		}
	}

	useEffect(() => {
		if (!currentUser?.user?.id || !profile?.id) return;
		if (profile.id === currentUser.user.id) return;
		friendshipStatus();
	}, [profile, currentUser]);

	async function getUserPosts() {
		if (!profile?.id) return []; // Prevent execution with invalid profile

		const response = await fetch(
			`${serverUrl}/api/posts/read/?authorID=${profile.id}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.error || 'Error fetching user posts');
		}

		const res = await response.json();
		return res;
	}

	const { data, error, isLoading } = useQuery({
		queryKey: profile?.id
			? ['posts', profile.username]
			: ['posts', 'undefined'],
		queryFn:
			profile?.id && currentUser?.user?.id
				? getUserPosts
				: () => Promise.resolve([]),
		enabled: !!profile?.id && !!currentUser?.user?.id,
	});

	return (
		<>
			{profile ? (
				<div style={{ border: '1px solid black' }}>
					<img
						src={profile.profilePic}
						alt={`${profile.username}'s profile picture`}
					/>
					<p>{profile.username}</p>
					<p>{profile.bio}</p>
				</div>
			) : (
				<p>Loading...</p>
			)}
			<div>
				{profile?.id === currentUser?.user?.id ? (
					<button onClick={() => navigate('/user/update')}>
						Update Profile
					</button>
				) : friendStatus === null ? (
					<FriendBtn currentUser={currentUser} receiverId={profile?.id} />
				) : friendStatus === 'Accepted' ? (
					<p>Friends</p>
				) : (
					<p>Request {friendStatus}</p>
				)}
			</div>
			<div>
				<p>{profile?.username}'s posts</p>
				{isLoading && <p>Loading...</p>}
				{error && <p>No posts found...</p>}
				<div>
					{data && data.length > 0 ? (
						data.map((post) => (
							<Post
								data={post}
								setPostVal={setPostVal}
								currentUser={currentUser}
								key={post.id}
								profileClick={false}
							/>
						))
					) : (
						<p>No posts found...</p>
					)}
				</div>
			</div>
		</>
	);
}
