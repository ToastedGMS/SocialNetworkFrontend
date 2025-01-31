import { useLikePost } from '../Hooks/useLikePost';

const LikeButton = ({ postId, user }) => {
	const { mutate: likePost, isLoading } = useLikePost();
	return (
		<button onClick={() => likePost({ postId, user })} disabled={isLoading}>
			{isLoading ? 'Liking...' : 'Like'}
		</button>
	);
};

export default LikeButton;
