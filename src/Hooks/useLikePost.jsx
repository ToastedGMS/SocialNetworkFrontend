import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const likePost = async ({ postId, user, dataType }) => {
	const response = await fetch(
		`${serverUrl}/api/likes/new?${dataType}ID=${postId}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
			body: JSON.stringify({ authorID: user.user.id }),
		}
	);
	console.log(postId);
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to like the ${dataType}`);
	}

	const res = await response.json();
	return res;
};

export function useLikePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: likePost,
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
		onError: (error) => {
			console.error('Error liking post:', error.message);
		},
	});
}
