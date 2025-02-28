import { useEffect } from 'react';
import AcceptFriendBtn from './AcceptFriendBtn';
import { useNavigate } from 'react-router-dom';
import style from './styles/FriendCard.module.css';

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
					className={style.card}
					onClick={() => {
						setProfile(friendship.receiver);
						navigate(`/user/${friendship.receiver.username}`);
					}}
				>
					<img
						className={style.cardImage}
						src={friendship.receiver.profilePic}
						alt="User profile picture"
					/>
					<p>{friendship.receiver.username}</p>
				</div>
			)}
			{currentUser.user.id === friendship.receiverId && (
				<div
					className={style.card}
					onClick={() => {
						setProfile(friendship.sender);
						navigate(`/user/${friendship.sender.username}`);
					}}
				>
					<img
						className={style.cardImage}
						src={friendship.sender.profilePic}
						alt="User profile picture"
					/>
					<p>{friendship.sender.username}</p>
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
