import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UserSearchCard({ user, currentUser }) {
	const [friendStatus, setFriendStatus] = useState(null);

	const navigate = useNavigate();

	async function friendshipStatus() {
		try {
			const senderId = currentUser.user.id;
			const receiverId = user.id;

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
		if (user.id !== currentUser.user.id) {
			friendshipStatus();
		}
	}, [user, currentUser]);

	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img
					src={user.profilePic}
					alt="User profile picture"
					style={{ width: '2em', borderRadius: '50%' }}
				/>
				<p style={{ marginLeft: '10px' }}>{user.username}</p>
			</div>
			{/* <div>
					{user.id === currentUser.user.id ? null : friendStatus === null ? (
						<button>Send Friend Request</button>
					) : (
						<p>Friendship Status: {friendStatus}</p>
					)}
				</div> */}
		</>
	);
}
