import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const updateComment = async ({ commentID, content, user }) => {
	const response = await fetch(
		`${serverUrl}/api/comments/update/${commentID}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
			body: JSON.stringify({ content: content }),
		}
	);
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to update the comment`);
	}

	const res = await response.json();
	return res;
};

export function useUpdateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateComment,
		onSuccess: () => {
			queryClient.invalidateQueries(['comments']);
		},
		// onError: (error) => {
		// 	console.error('Error updating comment:', error.message);
		// },
	});
}
