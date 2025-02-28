import React, { useState } from 'react';
import LikeButton from './LikeBtn';
import CommentBtn from './CommentBtn';
import DeleteBtn from './DeleteBtn';
import UpdateContent from './UpdateContent';
import { useLocation, useNavigate } from 'react-router-dom';
import style from './styles/EditBtn.module.css';
import post from './styles/Post.module.css';
import { format } from 'date-fns';

export default function Post({
	data,
	currentUser,
	setPostVal,
	hideComments,
	setProfile,
	profileClick,
	socket,
}) {
	const [updateStatus, setUpdateStatus] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const postData = location.state ? location.state.postData : null;
	if (!data.author) {
		data = postData;
	}

	return (
		<div className={post.container}>
			<div
				className={post.profile}
				onClick={
					profileClick
						? () => {
								setProfile(data.author);
								navigate(`/user/${data.author.username}`);
						  }
						: null
				}
			>
				<img src={data.author.profilePic} alt="User profile picture" />
				<p>{data.author.username}</p>
			</div>
			<div>
				<p className={post.content}>{data.content}</p>
				{data.image && <img className={post.image} src={data.image} />}
				<div className={post.date}>
					<p>{format(data.createdAt, 'MMM dd, yyyy h:mm a')}</p>
					{data.createdAt !== data.updatedAt && (
						<p>Edited: {format(data.updatedAt, 'MMM dd, yyyy h:mm a')}</p>
					)}
				</div>
			</div>
			<div className={post.actions}>
				{updateStatus && (
					<UpdateContent
						data={data}
						setUpdateStatus={setUpdateStatus}
						user={currentUser}
						dataType={'post'}
					/>
				)}

				{!updateStatus && (
					<>
						<LikeButton
							postId={data.id}
							user={currentUser}
							author={data.author.id}
							dataType={'post'}
							socket={socket}
						/>
						{!hideComments && <span>{data.likeCount}</span>}

						{!hideComments && (
							<>
								<CommentBtn postId={data.id} setPostVal={setPostVal} />
								<span>{data.commentCount}</span>

								{data.author.id === currentUser.user.id && (
									<>
										<DeleteBtn
											id={data.id}
											user={currentUser}
											dataType={'post'}
										/>
										<button
											onClick={() => setUpdateStatus(true)}
											className={[
												style.button,
												'fa-solid',
												'fa-pen-to-square',
											].join(' ')}
										></button>
									</>
								)}
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
