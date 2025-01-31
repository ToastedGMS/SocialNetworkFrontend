import React, { useContext, useEffect } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import { useQuery } from '@tanstack/react-query';
import Post from '../Reusable/Post';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Home() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
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
			const errorData = await response.json();
			throw new Error(errorData.error || 'Error fetching posts');
		}
		return response.json();
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
		<div>
			{data.map((post) => (
				<Post data={post} />
			))}
		</div>
	);
}
