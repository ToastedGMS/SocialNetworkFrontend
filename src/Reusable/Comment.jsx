import React, { useState } from 'react';
import LikeButton from './LikeBtn';
import DeleteBtn from './DeleteBtn';
import UpdateContent from './UpdateContent';
import { useNavigate } from 'react-router-dom';
import style from './styles/Comment.module.css';
import { format } from 'date-fns';

export default function Comment({
	data,
	currentUser,
	postID,
	setProfile,
	socket,
}) {
	const [updateStatus, setUpdateStatus] = useState(false);
	const navigate = useNavigate();

	return (
		<div className={style.container}>
			<div
				className={style.profile}
				onClick={() => {
					setProfile(data.author);
					navigate(`/user/${data.author.username}`);
				}}
			>
				<img src={data.author.profilePic} alt="User profile picture" />
				<p>{data.author.username}</p>
			</div>
			<div>
				<p className={style.content}>{data.content}</p>
				<div className={style.date}>
					<p>Posted on: {format(data.createdAt, 'MMM dd, yyyy h:mm a')}</p>
					{data.createdAt !== data.updatedAt && (
						<p>Edited:{format(data.updatedAt, 'MMM dd, yyyy h:mm a')}</p>
					)}
				</div>
			</div>
			<div className={style.actions}>
				{updateStatus && (
					<UpdateContent
						data={data}
						setUpdateStatus={setUpdateStatus}
						user={currentUser}
						dataType={'comment'}
					/>
				)}
				{!updateStatus && (
					<>
						<LikeButton
							postId={data.id}
							user={currentUser}
							dataType={'comment'}
							socket={socket}
						/>
						{
							//although it says POSTID, it is receiving the COMMENTID
						}
						{data.author.id === currentUser.user.id && (
							<>
								<DeleteBtn
									id={data.id}
									user={currentUser}
									dataType={'comment'}
									postId={postID}
								/>
								<button
									className={[
										style.button,
										'fa-solid',
										'fa-pen-to-square',
									].join(' ')}
									onClick={() => setUpdateStatus(true)}
								></button>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
