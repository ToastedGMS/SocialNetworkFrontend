import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const createComment = async ({ content, user, postID }) => {
	const response = await fetch(`${serverUrl}/api/comments/new`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${user.token}`,
		},
		body: JSON.stringify({
			authorID: user.user.id,
			content: content,
			postID: postID,
		}),
	});
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to create the comment`);
	}

	const res = await response.json();
	return res;
};

export function useCreateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createComment,
		onSuccess: () => {
			queryClient.invalidateQueries(['comments']);
		},
		onError: (error) => {
			console.error('Error creating comment:', error.message);
		},
	});
}
