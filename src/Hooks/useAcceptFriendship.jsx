import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const acceptFriendship = async ({ user, senderId }) => {
	const response = await fetch(`${serverUrl}/api/friendships/update`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.token}`,
		},
		body: JSON.stringify({
			receiverId: user.user.id,
			senderId,
			status: 'Accepted',
		}),
	});
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to create friendship`);
	}

	const res = await response.json();
	return res;
};

export function useAcceptFriendship() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: acceptFriendship,
		onSuccess: () => {
			queryClient.invalidateQueries(['friends']);
		},
		// onError: (error) => {
		// 	console.error('Error assing friend:', error.message);
		// },
	});
}
