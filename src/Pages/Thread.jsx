import React, { useContext, useEffect, useState } from 'react';
import PostContext from '../Context/postContext';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import Post from '../Reusable/Post';
import Comment from '../Reusable/Comment';
import { useQuery } from '@tanstack/react-query';
import NewContent from '../Reusable/NewContent';
import { SocketContext } from '../Context/socketContext';
import ProfileContext from '../Context/profileContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Thread() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const { setProfile } = useContext(ProfileContext);
	const { socket } = useContext(SocketContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser?.user?.id) {
			setError('Please login first.');
			navigate('/login');
			return;
		}
	}, [currentUser, setError, navigate]);

	const { postVal } = useContext(PostContext);
	const [postData, setPostData] = useState(null);

	const fetchPost = async () => {
		const response = await fetch(`${serverUrl}/api/posts/read?id=${postVal}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.error || 'Error fetching post');
		}

		const res = await response.json();
		setPostData(res);
	};

	const fetchComments = async () => {
		const response = await fetch(
			`${serverUrl}/api/comments/read?postID=${postVal}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.error || 'Error fetching comments');
		}

		const res = await response.json();
		return res;
	};
	const { data, isLoading } = useQuery({
		queryKey: ['comments', postVal],
		queryFn: fetchComments,
	});

	useEffect(() => {
		fetchPost();
	}, [postVal]);

	return (
		<>
			<div>
				{postData ? (
					<Post
						data={postData}
						currentUser={currentUser}
						hideComments={true}
						setProfile={setProfile}
						profileClick={true}
					/>
				) : (
					<p style={{ color: 'white' }}>Loading...</p>
				)}
			</div>
			<div>
				{data?.length > 0 ? (
					data.map((comment) => (
						<Comment
							data={comment}
							currentUser={currentUser}
							key={comment.id}
							postID={postVal}
							setProfile={setProfile}
						/>
					))
				) : isLoading ? (
					<p style={{ color: 'white' }}>Loading comments...</p>
				) : (
					<p style={{ color: 'white' }}>No comments yet...</p>
				)}
			</div>
			<div>
				{postData && (
					<NewContent
						currentUser={currentUser}
						postID={postVal}
						dataType={'comment'}
						socket={socket}
						postAuthor={postData.authorID}
					/>
				)}
			</div>
		</>
	);
}
