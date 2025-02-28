import { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/userContext';
import { useQuery } from '@tanstack/react-query';
import { SocketContext } from '../Context/socketContext';
import { useNavigate } from 'react-router-dom';
import style from './styles/Notifications.module.css';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Notifications() {
	const { currentUser } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser?.user?.id) {
			setError('Please login first.');
			navigate('/login');
			return;
		}

		if (socket && currentUser?.user?.id) {
			socket.emit('mark_notifications_read', currentUser.user.id);
		}
	}, [socket, currentUser]);

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
			<div className={style.container}>
				<div>
					<h2>Unread Notifications</h2>
					{data.unreadNotifs.map((notification) => {
						return (
							<div
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
								<p className={style.notif}>
									{notification.senderName} {notification.type}
								</p>
							</div>
						);
					})}
				</div>
				<div>
					<h2>Read Notifications</h2>
					{data.readNotifs.map((notification) => {
						return (
							<div
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
								<p className={style.notif}>
									{notification.senderName} {notification.type}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
