import { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/userContext';
import { useQuery } from '@tanstack/react-query';
import { SocketContext } from '../Context/socketContext';
import { useNavigate } from 'react-router-dom';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Notifications() {
	const { currentUser } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const navigate = useNavigate();

	useEffect(() => {
		socket.emit('mark_notifications_read', currentUser.user.id);
	}, []);

	const fetchNotifs = async () => {
		const response = await fetch(
			`${serverUrl}/api/notifications/read?id=${currentUser.user.id}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.error || 'Error fetching');
		}

		const res = await response.json();
		return res;
	};
	const { data, error, isLoading } = useQuery({
		queryKey: ['notifications'],
		queryFn: fetchNotifs,
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) {
		return (
			<>
				<p>Error: {error.message}</p>
			</>
		);
	}
	return (
		<>
			{data.map((notification) => {
				return (
					<div
						style={{ border: '1px solid black' }}
						key={notification.id}
						onClick={async () => {
							const data = await fetch(
								`${serverUrl}/api/posts/read?id=${notification.contentID}&authorID=${currentUser.user.id}`
							);

							if (!data.ok) {
								const errorResponse = await data.json();
								throw new Error(errorResponse.error || 'Error fetching');
							}

							const res = await data.json();

							navigate(`/post/${notification.contentID}`, {
								state: { postData: res },
							});
						}}
					>
						<p>
							{notification.senderName} {notification.type}
						</p>
					</div>
				);
			})}
		</>
	);
}
