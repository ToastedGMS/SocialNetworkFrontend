import { useContext, useState } from 'react';
import { useUpdatePost } from '../Hooks/useUpdatePost';
import { useUpdateComment } from '../Hooks/useUpdateComment';
import ErrorMessage from './ErrorMessage';

export default function UpdateContent({
	data,
	setUpdateStatus,
	user,
	dataType,
}) {
	const [content, setContent] = useState(data.content);
	const [image, setImage] = useState(data.image || '');
	const [initialImage] = useState(data.image || '');
	const [initialContent] = useState(data.content);
	const [errorMessage, setError] = useState(null);
	const { mutate: updatePost } = useUpdatePost();
	const { mutate: updateComment } = useUpdateComment();

	// Function to validate image URL
	const validateImageUrl = (url) => {
		const regex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/i;
		return regex.test(url);
	};

	const handleUpdate = () => {
		if (!content.trim()) {
			setError("Can't do that! Content cannot be empty.");
			return;
		}

		if (content === initialContent && image === initialImage) {
			setError('Unable to update, no changes made');
			return;
		}

		// Validate and set the image
		let validImage = null;
		if (image && validateImageUrl(image)) {
			validImage = image; // If valid, keep the image URL
		}

		if (dataType === 'post') {
			updatePost({
				postID: data.id,
				content: content,
				image: validImage,
				user: user,
			});
		} else if (dataType === 'comment') {
			updateComment({
				commentID: data.id,
				content: content,
				user: user,
			});
		}

		setUpdateStatus(false);
		setError('');
	};

	return (
		<div>
			<textarea
				name="input"
				id="input"
				cols="80"
				rows="3"
				placeholder="Update your content here..."
				value={content}
				onChange={(e) => setContent(e.target.value)}
				style={{ resize: 'none' }}
			></textarea>

			{dataType === 'post' && (
				<div>
					<label htmlFor="image">Image URL:</label>
					<input
						type="text"
						id="image"
						name="image"
						value={image}
						onChange={(e) => setImage(e.target.value)}
						placeholder="Optional image URL"
					/>
				</div>
			)}

			<div>
				{errorMessage && <ErrorMessage error={errorMessage} />}
				<button onClick={handleUpdate}>Update</button>
				<button onClick={() => setUpdateStatus(false)}>Cancel</button>
			</div>
		</div>
	);
}
