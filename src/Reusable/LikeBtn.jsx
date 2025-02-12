import { useEffect, useState } from 'react';
import { useLikePost } from '../Hooks/useLikePost';
import { useDislikePost } from '../Hooks/useDislikePost';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const LikeButton = ({ postId, user, dataType }) => {
	const { mutate: likePost } = useLikePost();
	const { mutate: dislikePost } = useDislikePost();
	const [isLiked, setIsLiked] = useState(false);

	const likeStatus = async () => {
		try {
			const response = await fetch(
				`${serverUrl}/api/likes/${dataType}?${dataType}ID=${postId}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					errorResponse.error || `Error fetching likes for ${dataType}`
				);
			}

			const res = await response.json();
			setIsLiked(res.some((like) => like.authorID === user.user.id));
		} catch (error) {
			console.error('Failed to fetch like status:', error);
		}
	};

	useEffect(() => {
		likeStatus();
	}, [postId]);
	return (
		<button
			onClick={() => {
				isLiked
					? dislikePost({ postId, user, dataType })
					: likePost({ postId, user, dataType });
				setIsLiked(isLiked ? false : true);
			}}
		>
			{isLiked ? 'Dislike' : 'Like'}
		</button>
	);
};

export default LikeButton;
