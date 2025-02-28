import style from './styles/UserSearchCard.module.css';

export default function UserSearchCard({ user, currentUser }) {
	return (
		<>
			<div className={style.container}>
				<img
					className={style.cardImage}
					src={user.profilePic}
					alt="User profile picture"
				/>
				<p className={style.username}>{user.username}</p>
			</div>
		</>
	);
}
