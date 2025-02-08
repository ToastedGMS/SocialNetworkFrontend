import { useState } from 'react';
import { useUpdatePost } from '../Hooks/useUpdatePost';
import { useUpdateComment } from '../Hooks/useUpdateComment';

export default function UpdateContent({
	data,
	setUpdateStatus,
	user,
	dataType,
}) {
	const [content, setContent] = useState(data.content);
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
						<button
							onClick={() => {
								updatePost({
									postID: data.id,
									content: content,
									user: user,
								});
								setUpdateStatus(false);
							}}
						>
							Update
						</button>
						<button onClick={() => setUpdateStatus(false)}>Cancel</button>
					</div>
				) : (
					<div>
						<button
							onClick={() => {
								updateComment({
									commentID: data.id,
									content: content,
									user: user,
								});
								setUpdateStatus(false);
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
