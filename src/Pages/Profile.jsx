import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import ProfileContext from '../Context/profileContext';
import UserContext from '../Context/userContext';
import PostContext from '../Context/postContext';
import { useQuery } from '@tanstack/react-query';
import Post from '../Reusable/Post';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Profile() {
	const { setError } = useContext(ErrorContext);
	const { currentUser } = useContext(UserContext);
	const { profile } = useContext(ProfileContext);
	const { setPostVal } = useContext(PostContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === null) {
			setError('Please login first.');
			navigate('/login');
		}
	}, [currentUser, navigate, setError]);

	async function getUserPosts() {
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
		queryKey: profile ? ['posts', profile.username] : ['posts', 'undefined'],
		queryFn: getUserPosts,
		enabled: !!profile,
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
					<p>{profile.bio}</p>{' '}
				</div>
			) : (
				<p>Loading...</p>
			)}
			<div>
				<p>{profile.username}'s posts</p>
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
