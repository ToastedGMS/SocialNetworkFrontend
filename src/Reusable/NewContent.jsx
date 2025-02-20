import React, { useState } from 'react';
import { useCreateComment } from '../Hooks/useCreateComment';
import { useCreatePost } from '../Hooks/useCreatePost';
import ErrorMessage from './ErrorMessage';

export default function NewContent({
	currentUser,
	postID,
	dataType,
	socket,
	postAuthor,
}) {
	const [postContent, setPostContent] = useState('');
	const { mutate: createPost } = useCreatePost();

	const [commentContent, setCommentContent] = useState('');
	const { mutate: createComment } = useCreateComment();

	const [errorMessage, setError] = useState(null);
	const [imageVal, setImageVal] = useState('');
	const [isValidImage, setIsValidImage] = useState(true);

	const [addImage, setAddImage] = useState(false);

	// Function to check if the image URL is valid using a Promise
	const checkImageValidity = (url) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = url;
			img.onload = () => resolve(true); // Image loaded successfully
			img.onerror = () => resolve(false); // Image failed to load
		});
	};

	const handleImageChange = (e) => {
		const url = e.target.value;
		setImageVal(url);

		if (url) {
			checkImageValidity(url).then((isValid) => {
				setIsValidImage(isValid);
			});
		} else {
			setIsValidImage(true); // Allow empty image URL
		}
	};

	function sendComment() {
		createComment({
			content: commentContent,
			user: currentUser,
			postID: postID,
		});
		socket.emit('new_comment', {
			sender: currentUser.user.id,
			post: postID,
			senderName: currentUser.user.username,
			receiver: postAuthor,
		});
		setCommentContent('');
	}

	function sendPost() {
		createPost({
			content: postContent,
			user: currentUser,
			image: isValidImage ? imageVal : null,
		});
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
					{errorMessage && <ErrorMessage error={errorMessage} />}
					<button
						onClick={() => {
							if (!commentContent.trim()) {
								setError("Can't post empty comment!");
								return;
							}
							sendComment();
							setError('');
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
					{addImage && (
						<>
							<label htmlFor="image">Image URL:</label>
							<input
								type="text"
								name="image"
								id="image"
								placeholder="Optional image URL"
								value={imageVal}
								onChange={handleImageChange}
							/>
						</>
					)}
					{!isValidImage && <p style={{ color: 'red' }}>Invalid image URL</p>}
					{errorMessage && <ErrorMessage error={errorMessage} />}
					<button onClick={() => setAddImage(!addImage)}>
						{addImage ? 'Hide Image Input' : 'Show Image Input'}
					</button>{' '}
					<button
						onClick={() => {
							if (!postContent.trim()) {
								setError("Can't publish empty post!");
								return;
							}
							if (!isValidImage && imageVal) {
								setError('The image URL is invalid.');
								return;
							}
							sendPost();
							setError('');
						}}
					>
						Post
					</button>
				</>
			)}
		</div>
	);
}
