import React, { useEffect, useState } from 'react';
import { useCreateComment } from '../Hooks/useCreateComment';
import { useCreatePost } from '../Hooks/useCreatePost';
import ErrorMessage from './ErrorMessage';
const serverUrl = import.meta.env.VITE_SERVER_URL;

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

	const [file, setFile] = useState(null);
	const [uploadResponse, setUploadResponse] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	useEffect(() => {
		if (uploadResponse) {
			setImageVal(uploadResponse.fileUrl);
		}
	}, [uploadResponse]);

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch(`${serverUrl}/upload`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorText = await response.text(); // Read the response body as text
				console.error('Error response:', errorText);
				return;
			}

			const result = await response.json();
			setUploadResponse(result);
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

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
					<button
						onClick={() => {
							if (!postContent.trim()) {
								setError("Can't publish empty post!");
								return;
							}
							sendPost();
							setError('');
						}}
					>
						Post
					</button>
					<div>
						<input type="file" onChange={handleFileChange} />
						<button onClick={handleUpload}>Upload</button>

						{uploadResponse && (
							<div>
								<p>{uploadResponse.message}</p>
								<p>Image preview:</p>
								<img src={uploadResponse.fileUrl} alt="no" width={'200px'} />
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
