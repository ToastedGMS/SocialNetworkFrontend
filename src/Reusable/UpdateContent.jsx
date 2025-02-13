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
	const [initialContent] = useState(data.content);
	const [errorMessage, setError] = useState(null);
	const { mutate: updatePost } = useUpdatePost();
	const { mutate: updateComment } = useUpdateComment();
	return (
		<>
			<div>
				<textarea
					name="input"
					id="input"
					cols="80"
					rows="3"
					placeholder="The delete button is better for that :)"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					style={{ resize: 'none' }}
				></textarea>
				{dataType === 'post' ? (
					<div>
						{errorMessage && <ErrorMessage error={errorMessage} />}

						<button
							onClick={() => {
								if (!content.trim()) {
									setError("Can't do that!");
									return;
								}
								if (content === initialContent) {
									setError('Unable to update, no changes made');
									return;
								}
								if (content != initialContent) {
									updatePost({
										postID: data.id,
										content: content,
										user: user,
									});
									setUpdateStatus(false);
									setError('');
								}
							}}
						>
							Update
						</button>
						<button onClick={() => setUpdateStatus(false)}>Cancel</button>
					</div>
				) : (
					<div>
						{errorMessage && <ErrorMessage error={errorMessage} />}

						<button
							onClick={() => {
								if (!content.trim()) {
									setError("Can't do that!");
									return;
								}
								if (content === initialContent) {
									setError('Unable to update, no changes made');
									return;
								}
								if (content != initialContent) {
									updateComment({
										commentID: data.id,
										content: content,
										user: user,
									});
									setUpdateStatus(false);
									setError('');
								}
							}}
						>
							Update
						</button>
						<button onClick={() => setUpdateStatus(false)}>Cancel</button>
					</div>
				)}
			</div>
		</>
	);
}
