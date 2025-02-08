import React, { useState } from 'react';
import { useCreateComment } from '../Hooks/useCreateComment';

export default function NewComment({ currentUser, postID }) {
	const [commentContent, setCommentContent] = useState('');
	const { mutate: createComment } = useCreateComment();

	function sendComment() {
		createComment({
			content: commentContent,
			user: currentUser,
			postID: postID,
		});
		setCommentContent('');
	}

	return (
		<div>
			<textarea
				name="input"
				id="input"
				cols="80"
				rows="3"
				placeholder="Add a comment..."
				value={commentContent}
				onChange={(e) => {
					setCommentContent(e.target.value);
				}}
				style={{ resize: 'none' }}
			></textarea>
			<button
				onClick={() => {
					sendComment();
				}}
			>
				Post
			</button>
		</div>
	);
}
