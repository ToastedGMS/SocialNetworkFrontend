import { useEffect, useState } from 'react';
import { useLikePost } from '../Hooks/useLikePost';
import { useDislikePost } from '../Hooks/useDislikePost';
import style from './styles/LikeBtn.module.css';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function LikeButton({
	postId,
	user,
	dataType,
	author,
	socket,
	likeCount,
	setLikeCount,
}) {
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
			// console.error('Failed to fetch like status:', error);
		}
	};

	function handleLike() {
		likePost({ postId, user, dataType });

		if (setLikeCount) {
			setLikeCount(likeCount + 1);
		}

		socket.emit('new_like', {
			sender: user.user.id,
			receiver: author,
			post: postId,
			senderName: user.user.username,
		});
	}

	function handleDislike() {
		dislikePost({ postId, user, dataType });

		if (setLikeCount) {
			setLikeCount(likeCount - 1);
		}
	}

	useEffect(() => {
		likeStatus();
	}, [postId]);

	return (
		<button
			className={[
				isLiked ? 'fa-solid' : 'fa-regular',
				'fa-heart',
				style.button,
			].join(' ')}
			onClick={() => {
				isLiked ? handleDislike() : handleLike();
				setIsLiked((prev) => !prev);
			}}
		></button>
	);
}
