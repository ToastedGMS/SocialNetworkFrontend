import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const createFriendship = async ({ user, receiverId }) => {
	const response = await fetch(`${serverUrl}/api/friendships/new`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.token}`,
		},
		body: JSON.stringify({ senderId: user.user.id, receiverId }),
	});
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to create friendship`);
	}

	const res = await response.json();
	return res;
};

export function useCreateFriendship() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createFriendship,
		onSuccess: () => {
			queryClient.invalidateQueries(['friends']);
		},
		// onError: (error) => {
		// 	console.error('Error assing friend:', error.message);
		// },
	});
}
