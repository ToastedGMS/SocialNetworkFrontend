import { useDeletePost } from '../Hooks/useDeletePost';

const DeleteBtn = ({ postId, user }) => {
	const { mutate: deletePost } = useDeletePost();

	return (
		<button
			onClick={() => {
				deletePost({ postId, user });
			}}
		>
			Delete
		</button>
	);
};

export default DeleteBtn;
