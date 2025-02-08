import React, { useState } from 'react';
import { useCreateComment } from '../Hooks/useCreateComment';
import { useCreatePost } from '../Hooks/useCreatePost';

export default function NewContent({ currentUser, postID, dataType }) {
	const [postContent, setPostContent] = useState('');
	const { mutate: createPost } = useCreatePost();

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

	function sendPost() {
		createPost({ content: postContent, user: currentUser });
		setPostContent('');
	}

	return (
		<div>
			{dataType === 'comment' ? (
				// Comment textarea and button
				<>
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
				</>
			) : (
				// Post textarea and button
				<>
					<img
						src={currentUser.user.profilePic}
						alt="User profile picture"
						style={{ width: '3em' }}
					/>
					<textarea
						name="input"
						id="input"
						cols="80"
						rows="3"
						placeholder="What's on your mind?"
						value={postContent}
						onChange={(e) => {
							setPostContent(e.target.value);
						}}
						style={{ resize: 'none' }}
					></textarea>
					<button
						onClick={() => {
							sendPost();
						}}
					>
						Post
					</button>
				</>
			)}
		</div>
	);
}
