import { useDeleteComment } from '../Hooks/useDeleteComment';
import { useDeletePost } from '../Hooks/useDeletePost';

const DeleteBtn = ({ id, user, dataType, postId }) => {
	const { mutate: deletePost } = useDeletePost();
	const { mutate: deleteComment } = useDeleteComment(postId);

	return (
		<div>
			{dataType === 'post' ? (
				<button
					onClick={() => {
						deletePost({ postId: id, user });
					}}
				>
					Delete
				</button>
			) : (
				<button
					onClick={() => {
						deleteComment({ commentID: id, user });
					}}
				>
					Delete
				</button>
			)}
		</div>
	);
};

export default DeleteBtn;
