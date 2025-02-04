import React from 'react';
import LikeButton from './LikeBtn';

export default function Comment({ data, currentUser }) {
	return (
		<div style={{ border: '1px solid black' }}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
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
			<div>
				<LikeButton postId={data.id} user={currentUser} dataType={'comment'} />
				{
					//although it says POSTID, it is receiving the COMMENTID
				}
			</div>
		</div>
	);
}
