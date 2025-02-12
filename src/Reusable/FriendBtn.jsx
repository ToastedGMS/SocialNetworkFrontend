import { useState } from 'react';
import { useCreateFriendship } from '../Hooks/useCreateFriendship';

export default function FriendBtn({ currentUser, receiverId }) {
	const [sentRequest, setSentRequest] = useState(false);
	const { mutate: createFriendship } = useCreateFriendship();

	return (
		<>
			{sentRequest ? (
				<p>Request Sent</p>
			) : (
				<button
					onClick={() => {
						createFriendship({ user: currentUser, receiverId });
						setSentRequest(true);
					}}
				>
					{' '}
					Add Friend
				</button>
			)}
		</>
	);
}
