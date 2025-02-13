import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const dislikePost = async ({ postId, user, dataType }) => {
	const response = await fetch(
		`${serverUrl}/api/likes/remove?${dataType}ID=${postId}`,
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
			body: JSON.stringify({ authorID: user.user.id }),
		}
	);
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to dislike the ${dataType}`);
	}

	const res = await response.json();
	return res;
};

export function useDislikePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: dislikePost,
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
		// onError: (error) => {
		// 	console.error('Error disliking post:', error.message);
		// },
	});
}
