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
						const isConfirmed = window.confirm(
							'Are you sure you want to delete this post? This action is irreversible!'
						);

						if (!isConfirmed) return;
						deletePost({ postId: id, user });
					}}
				>
					Delete
				</button>
			) : (
				<button
					onClick={() => {
						const isConfirmed = window.confirm(
							'Are you sure you want to delete this comment? This action is irreversible!'
						);

						if (!isConfirmed) return;
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
