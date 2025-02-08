import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const updatePost = async ({ postID, content, user }) => {
	const response = await fetch(`${serverUrl}/api/posts/update/${postID}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.token}`,
		},
		body: JSON.stringify({ content: content }),
	});
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to update the post`);
	}

	const res = await response.json();
	return res;
};

export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updatePost,
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
		onError: (error) => {
			console.error('Error updating post:', error.message);
		},
	});
}
