import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CommentBtn({ postId, setPostVal }) {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => {
				setPostVal(postId);
				navigate(`/post/${postId}`);
			}}
		>
			Comments
		</button>
	);
}
