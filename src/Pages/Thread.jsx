import React, { useContext, useEffect, useState } from 'react';
import PostContext from '../Context/postContext';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import Post from '../Reusable/Post';
import Comment from '../Reusable/Comment';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Thread() {
	const { currentUser } = useContext(UserContext);
	const { setError } = useContext(ErrorContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === null) {
			setError('Please login first.');
			navigate('/login');
		}
	}, [currentUser, setError, navigate]);

	const { postVal } = useContext(PostContext);
	const [postData, setPostData] = useState(null);
	const [commentData, setCommentData] = useState(null);

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
		setCommentData(res);
		return res;
	};

	useEffect(() => {
		fetchPost();
		fetchComments();
	}, [postVal]);

	return (
		<>
			<div>
				{postData ? (
					<Post data={postData} currentUser={currentUser} hideComments={true} />
				) : (
					<p>Loading...</p>
				)}
			</div>
			<div>
				{commentData ? (
					commentData.map((comment) => {
						return (
							<Comment
								data={comment}
								currentUser={currentUser}
								key={comment.id}
							/>
						);
					})
				) : (
					<p>No comments yet...</p>
				)}
			</div>
		</>
	);
}
