import React, { useState } from 'react';
import { useCreatePost } from '../Hooks/useCreatePost';

export default function NewPost({ currentUser }) {
	const [postContent, setPostContent] = useState('');
	const { mutate: createPost } = useCreatePost();

	function sendPost() {
		createPost({ content: postContent, user: currentUser });
		setPostContent('');
	}

	return (
		<div>
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
				placeholder="Whats on your mind?"
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
		</div>
	);
}
