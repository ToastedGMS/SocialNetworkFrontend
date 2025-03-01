import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './styles/CommentBtn.module.css';

export default function CommentBtn({ postId, setPostVal, isGuest }) {
	const navigate = useNavigate();
	return (
		<button
			disabled={isGuest ? true : false}
			className={['fa-solid', 'fa-comment', style.button].join(' ')}
			onClick={() => {
				setPostVal(postId);
				navigate(`/post/${postId}`);
			}}
		></button>
	);
}
