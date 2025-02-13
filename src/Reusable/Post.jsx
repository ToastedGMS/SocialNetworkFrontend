import React, { useState } from 'react';
import LikeButton from './LikeBtn';
import CommentBtn from './CommentBtn';
import DeleteBtn from './DeleteBtn';
import UpdateContent from './UpdateContent';
import { useNavigate } from 'react-router-dom';

export default function Post({
	data,
	currentUser,
	setPostVal,
	hideComments,
	setProfile,
	profileClick,
}) {
	const [updateStatus, setUpdateStatus] = useState(false);
	const navigate = useNavigate();

	return (
		<div style={{ border: '1px solid black' }}>
			<div
				style={{ display: 'flex', alignItems: 'center' }}
				onClick={
					profileClick
						? () => {
								setProfile(data.author);
								navigate(`/user/${data.author.username}`);
						  }
						: null
				}
			>
				<img
					src={data.author.profilePic}
					alt="User profile picture"
					style={{ width: '5em' }}
				/>
				<p>{data.author.username}</p>
			</div>
			<div>
				<p>{data.content}</p>
				{data.image && <img src={data.image} alt={'Post Image'} />}
				<p>Posted on: {data.createdAt}</p>
				{data.createdAt !== data.updatedAt && <p>Edited: {data.updatedAt}</p>}
			</div>
			{updateStatus && (
				<UpdateContent
					data={data}
					setUpdateStatus={setUpdateStatus}
					user={currentUser}
					dataType={'post'}
				/>
			)}
			<div>
				<LikeButton postId={data.id} user={currentUser} dataType={'post'} />
				{!hideComments && <span>{data.likeCount}</span>}
			</div>
			{!hideComments && (
				<div>
					<CommentBtn postId={data.id} setPostVal={setPostVal} />
					<span>{data.commentCount}</span>

					{data.author.id === currentUser.user.id && (
						<div>
							<DeleteBtn id={data.id} user={currentUser} dataType={'post'} />
							<button onClick={() => setUpdateStatus(true)}>Edit</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
