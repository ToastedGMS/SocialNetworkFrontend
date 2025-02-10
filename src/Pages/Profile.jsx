import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import ProfileContext from '../Context/profileContext';
import UserContext from '../Context/userContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Profile() {
	const { setError } = useContext(ErrorContext);
	const { currentUser } = useContext(UserContext);
	const { profile } = useContext(ProfileContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === null) {
			setError('Please login first.');
			navigate('/login');
		}
	}, [currentUser, navigate, setError]);

	return (
		<>
			<div>
				<img
					src={profile.profilePic}
					alt={`${profile.username}'s profile picture`}
				/>
				<p>{profile.username}</p>
				<p>{profile.bio}</p>
			</div>
		</>
	);
}
