import { useState } from 'react';
import { useAcceptFriendship } from '../Hooks/useAcceptFriendship';

export default function AcceptFriendBtn({ currentUser, senderId }) {
	const [acceptedRequest, setAcceptedRequest] = useState(false);
	const { mutate: acceptFriendship } = useAcceptFriendship();

	return (
		<>
			{acceptedRequest ? (
				<p>Request Accepted</p>
			) : (
				<button
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
