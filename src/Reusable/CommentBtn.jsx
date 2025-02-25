import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './styles/CommentBtn.module.css';

export default function CommentBtn({ postId, setPostVal }) {
	const navigate = useNavigate();
	return (
		<button
			className={['fa-solid', 'fa-comment', style.button].join(' ')}
			onClick={() => {
				setPostVal(postId);
				navigate(`/post/${postId}`);
			}}
		></button>
	);
}
