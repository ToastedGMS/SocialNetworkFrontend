import React, { useState } from 'react';
import LikeButton from './LikeBtn';
import DeleteBtn from './DeleteBtn';
import UpdateContent from './UpdateContent';
import { useNavigate } from 'react-router-dom';

export default function Comment({ data, currentUser, postID, setProfile }) {
	const [updateStatus, setUpdateStatus] = useState(false);
	const navigate = useNavigate();

	return (
		<div style={{ border: '1px solid black' }}>
			<div
				style={{ display: 'flex', alignItems: 'center' }}
				onClick={() => {
					setProfile(data.author);
					navigate(`/user/${data.author.username}`);
				}}
			>
				<img
					src={data.author.profilePic}
					alt="User profile picture"
					style={{ width: '3.5em' }}
				/>
				<p style={{ fontSize: '.9em' }}>{data.author.username}</p>
			</div>
			<div>
				<p style={{ fontSize: '.9em' }}>{data.content}</p>
				<p style={{ fontSize: '.9em' }}>Posted on: {data.createdAt}</p>
				{data.createdAt !== data.updatedAt && (
					<p style={{ fontSize: '.9em' }}>Edited: {data.updatedAt}</p>
				)}
			</div>
			{updateStatus && (
				<UpdateContent
					data={data}
					setUpdateStatus={setUpdateStatus}
					user={currentUser}
					dataType={'comment'}
				/>
			)}
			<div>
				<LikeButton postId={data.id} user={currentUser} dataType={'comment'} />
				{
					//although it says POSTID, it is receiving the COMMENTID
				}
			</div>
			{data.author.id === currentUser.user.id && (
				<div>
					{' '}
					<DeleteBtn
						id={data.id}
						user={currentUser}
						dataType={'comment'}
						postId={postID}
					/>
					<button onClick={() => setUpdateStatus(true)}>Edit</button>
				</div>
			)}
		</div>
	);
}
