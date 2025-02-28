import { useState } from 'react';
import { useAcceptFriendship } from '../Hooks/useAcceptFriendship';
import style from './styles/AcceptFriendBtn.module.css';

export default function AcceptFriendBtn({ currentUser, senderId }) {
	const [acceptedRequest, setAcceptedRequest] = useState(false);
	const { mutate: acceptFriendship } = useAcceptFriendship();

	return (
		<>
			{acceptedRequest ? (
				<p>Request Accepted</p>
			) : (
				<button
					className={style.button}
					onClick={() => {
						acceptFriendship({ user: currentUser, senderId });
						setAcceptedRequest(true);
					}}
				>
					{' '}
					Accept Request
				</button>
			)}
		</>
	);
}
