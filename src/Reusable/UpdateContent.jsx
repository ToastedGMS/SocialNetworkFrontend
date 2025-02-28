import { useContext, useState } from 'react';
import { useUpdatePost } from '../Hooks/useUpdatePost';
import { useUpdateComment } from '../Hooks/useUpdateComment';
import ErrorMessage from './ErrorMessage';
import style from './styles/UpdateContent.module.css';

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

	const handleUpdate = () => {
		if (!content.trim()) {
			setError("Can't do that! Content cannot be empty.");
			return;
		}

		if (content === initialContent && image === initialImage) {
			setError('Unable to update, no changes made');
			return;
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
				className={style.textInput}
				maxLength={1000}
				minLength={1}
				style={{ resize: 'none' }}
			></textarea>

			<div className={style.action}>
				{errorMessage && <ErrorMessage error={errorMessage} />}
				<button className={style.button} onClick={handleUpdate}>
					Update
				</button>
				<button className={style.button} onClick={() => setUpdateStatus(false)}>
					Cancel
				</button>
			</div>
		</div>
	);
}
