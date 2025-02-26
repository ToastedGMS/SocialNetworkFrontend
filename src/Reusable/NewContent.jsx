import React, { useState, useEffect } from 'react';
import { useCreateComment } from '../Hooks/useCreateComment';
import { useCreatePost } from '../Hooks/useCreatePost';
import ErrorMessage from './ErrorMessage';
const serverUrl = import.meta.env.VITE_SERVER_URL;
import style from './styles/NewContent.module.css';

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

	const [file, setFile] = useState(null);
	const [fileInfo, setFileInfo] = useState(null);
	const [uploadResponse, setUploadResponse] = useState(null);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);

		if (selectedFile) {
			setFileInfo({
				name: selectedFile.name,
				size: (selectedFile.size / 1024).toFixed(2) + ' KB',
			});
		} else {
			setFileInfo(null);
		}
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
				const errorText = await response.text();
				console.error('Error response:', errorText);
				return;
			}

			const result = await response.json();
			setUploadResponse(result);
			return result.fileUrl;
		} catch (error) {
			console.error('Error uploading file:', error);
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

	function sendPost(imageUrl) {
		createPost({
			content: postContent,
			user: currentUser,
			image: imageUrl || null,
		});
		setPostContent('');
	}

	return (
		<div className={style.container}>
			{dataType === 'comment' ? (
				<>
					<textarea
						className={style.textInput}
						name="input"
						id="input"
						cols="80"
						rows="3"
						placeholder="Add a comment..."
						value={commentContent}
						onChange={(e) => setCommentContent(e.target.value)}
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
				<>
					<div className={style.content}>
						<img src={currentUser.user.profilePic} alt="User profile picture" />
						<textarea
							className={style.textInput}
							name="input"
							id="input"
							cols="80"
							rows="3"
							placeholder="What's on your mind?"
							value={postContent}
							onChange={(e) => setPostContent(e.target.value)}
						></textarea>
					</div>

					<div className={style.actions}>
						<button
							className={style.postBtn}
							onClick={async () => {
								if (!postContent.trim()) {
									setError("Can't publish empty post!");
									return;
								}

								let uploadedImageUrl = null;
								if (file) {
									uploadedImageUrl = await handleUpload();
									setUploadResponse(null);
								}

								sendPost(uploadedImageUrl);

								setFile(null);
								setFileInfo(null);
								setUploadResponse(null);
								setImageVal('');
								setError('');
							}}
						>
							Post
						</button>
						<label className={style.fileLabel}>
							<i className="fa-solid fa-camera"></i>
							<input
								type="file"
								className={style.file}
								accept="image/png, image/gif, image/jpeg, image/jpg"
								onChange={handleFileChange}
							/>
						</label>
						{fileInfo && (
							<div className="file-info">
								<p className={style.fileInfo}>Selected File: {fileInfo.name}</p>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
