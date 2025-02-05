import React from 'react';
import LikeButton from './LikeBtn';
import CommentBtn from './CommentBtn';

export default function Post({ data, currentUser, setPostVal, hideComments }) {
	return (
		<div style={{ border: '1px solid black' }}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img
					src={data.author.profilePic}
					alt="User profile picture"
					style={{ width: '5em' }}
				/>
				<p>{data.author.username}</p>
			</div>
			<div>
				<p>{data.content}</p>
				<p>Posted on: {data.createdAt}</p>
				{data.createdAt !== data.updatedAt && <p>Edited: {data.updatedAt}</p>}
			</div>
			<div>
				<LikeButton postId={data.id} user={currentUser} dataType={'post'} />
				<span>{data.likeCount}</span>
			</div>
			{!hideComments && (
				<div>
					<CommentBtn postId={data.id} setPostVal={setPostVal} />
					<span>{data.commentCount}</span>
				</div>
			)}
		</div>
	);
}
