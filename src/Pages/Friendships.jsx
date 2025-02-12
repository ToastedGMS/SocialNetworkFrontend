import React, { useContext, useEffect } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import PostContext from '../Context/postContext';
import ProfileContext from '../Context/profileContext';
import { useQuery } from '@tanstack/react-query';
import FriendCard from '../Reusable/FriendCard';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Friendships() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const { setProfile } = useContext(ProfileContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === null) {
			setError('Please login first.');
			navigate('/login');
		}
	}, [currentUser, setError, navigate]);

	async function getFriends() {
		const response = await fetch(
			`${serverUrl}/api/friendships/all/${currentUser.user.id}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.error || 'Error fetching friends');
		}

		const res = await response.json();
		return res;
	}

	const { data, error, isLoading } = useQuery({
		queryKey: ['friends'],
		queryFn: getFriends,
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) {
		setError(error.message);
		return <p>Error: {error.message}</p>;
	}

	return (
		<>
			<div>
				<div>
					<p>Pending Friendships</p>
					{data.pendingFriendships.map((friendship) => (
						<FriendCard
							key={friendship.id}
							currentUser={currentUser}
							friendship={friendship}
							status={'pending'}
						/>
					))}
				</div>
				<div>
					<p>Accepted Friendships</p>
					{data.acceptedFriendships.map((friendship) => (
						<FriendCard
							key={friendship.id}
							currentUser={currentUser}
							friendship={friendship}
						/>
					))}
				</div>
			</div>
		</>
	);
}
