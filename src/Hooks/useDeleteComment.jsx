import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const deleteComment = async ({ commentID, user }) => {
	const response = await fetch(
		`${serverUrl}/api/comments/delete/${commentID}`,
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
		throw new Error(res.message || `Failed to delete the comment`);
	}
	const deletedComment = { id: commentID };
	return deletedComment;
};

export function useDeleteComment(postId) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteComment,
		onSuccess: (deletedComment) => {
			// Manually update the cache by removing the deleted comment
			queryClient.setQueryData(['comments', postId], (oldData) => {
				// Filter out the deleted comment from the list
				return oldData.filter((comment) => comment.id !== deletedComment.id);
			}); //this is necessary because for some reason for the first element the cache wasn't being deleted
		},
		onError: (error) => {
			console.error('Error deleting comment:', error.message);
		},
	});
}
