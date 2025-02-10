import React, { useContext, useEffect } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import { useQuery } from '@tanstack/react-query';
import PostContext from '../Context/postContext';
import ProfileContext from '../Context/profileContext';
import Post from '../Reusable/Post';
import NewContent from '../Reusable/NewContent';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Home() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const { setPostVal } = useContext(PostContext);
	const { setProfile } = useContext(ProfileContext);

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

	if (isLoading) return <p>Loading...</p>;
	if (error) {
		setError(error.message);
		return <p>Error: {error.message}</p>;
	}

	return (
		<>
			<NewContent currentUser={currentUser} postID={null} dataType={'post'} />
			<div>
				{data.map((post) => (
					<Post
						setProfile={setProfile}
						data={post}
						currentUser={currentUser}
						setPostVal={setPostVal}
						key={post.id}
						profileClick={true}
					/>
				))}
			</div>
		</>
	);
}
