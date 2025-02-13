import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const createPost = async ({ content, user }) => {
	const response = await fetch(`${serverUrl}/api/posts/new`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.token}`,
		},
		body: JSON.stringify({ authorID: user.user.id, content: content }),
	});
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to create the post`);
	}

	const res = await response.json();
	return res;
};

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPost,
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
		// onError: (error) => {
		// 	console.error('Error creating post:', error.message);
		// },
	});
}
