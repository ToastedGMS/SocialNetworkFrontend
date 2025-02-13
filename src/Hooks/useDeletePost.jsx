import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const deletePost = async ({ postId, user }) => {
	const response = await fetch(`${serverUrl}/api/posts/delete/${postId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.token}`,
		},
		body: JSON.stringify({ authorID: user.user.id }),
	});
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to delete the post`);
	}

	const res = await response.json();
	return res;
};

export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePost,
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
		// onError: (error) => {
		// 	console.error('Error deleting post:', error.message);
		// },
	});
}
