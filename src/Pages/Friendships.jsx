import React, { useContext, useEffect } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import { useQuery } from '@tanstack/react-query';
import FriendCard from '../Reusable/FriendCard';
import ProfileContext from '../Context/profileContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Friendships() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const { setProfile } = useContext(ProfileContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser?.user?.id) {
			setError('Please login first.');
			navigate('/login');
			return;
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
					{data.pendingFriendships && data.pendingFriendships.length !== 0 ? (
						data.pendingFriendships.map((friendship) => (
							<FriendCard
								key={friendship.id}
								currentUser={currentUser}
								friendship={friendship}
								status={'pending'}
								setProfile={setProfile}
							/>
						))
					) : (
						<p>No pending friend requests.</p>
					)}
				</div>
				<div>
					<p>Accepted Friendships</p>
					{data.acceptedFriendships && data.acceptedFriendships.length !== 0 ? (
						data.acceptedFriendships.map((friendship) => (
							<FriendCard
								key={friendship.id}
								currentUser={currentUser}
								friendship={friendship}
								setProfile={setProfile}
							/>
						))
					) : (
						<p>No accepted friend requests.</p>
					)}
				</div>
			</div>
		</>
	);
}
