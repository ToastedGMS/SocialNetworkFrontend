import { useEffect } from 'react';
import AcceptFriendBtn from './AcceptFriendBtn';
import { useNavigate } from 'react-router-dom';

export default function FriendCard({
	currentUser,
	friendship,
	status,
	setProfile,
}) {
	const navigate = useNavigate();
	return (
		<>
			{currentUser.user.id === friendship.senderId && (
				<div
					style={{ display: 'flex', alignItems: 'center' }}
					onClick={() => {
						setProfile(friendship.receiver);
						navigate(`/user/${friendship.receiver.username}`);
					}}
				>
					<img
						src={friendship.receiver.profilePic}
						alt="User profile picture"
						style={{ width: '2em', borderRadius: '50%' }}
					/>
					<p style={{ marginLeft: '10px' }}>{friendship.receiver.username}</p>
				</div>
			)}
			{currentUser.user.id === friendship.receiverId && (
				<div
					style={{ display: 'flex', alignItems: 'center' }}
					onClick={() => {
						setProfile(friendship.sender);
						navigate(`/user/${friendship.sender.username}`);
					}}
				>
					<img
						src={friendship.sender.profilePic}
						alt="User profile picture"
						style={{ width: '2em', borderRadius: '50%' }}
					/>
					<p style={{ marginLeft: '10px' }}>{friendship.sender.username}</p>
					{status === 'pending' && (
						<AcceptFriendBtn
							currentUser={currentUser}
							senderId={friendship.sender.id}
						/>
					)}
				</div>
			)}
		</>
	);
}
