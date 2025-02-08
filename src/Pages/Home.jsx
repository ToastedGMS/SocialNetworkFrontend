import React, { useContext, useEffect } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import { useQuery } from '@tanstack/react-query';
import PostContext from '../Context/postContext';
import Post from '../Reusable/Post';
import NewPost from '../Reusable/NewPost';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Home() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const { setPostVal } = useContext(PostContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === null) {
			setError('Please login first.');
			navigate('/login');
		}
	}, [currentUser, setError, navigate]);

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

	useEffect(() => {
		console.log('data', data);
	}, [data]);

	if (isLoading) return <p>Loading...</p>;
	if (error) {
		setError(error.message);
		return <p>Error: {error.message}</p>;
	}

	return (
		<>
			<NewPost currentUser={currentUser} />
			<div>
				{data.map((post) => (
					<Post
						data={post}
						currentUser={currentUser}
						setPostVal={setPostVal}
						key={post.id}
					/>
				))}
			</div>
		</>
	);
}
