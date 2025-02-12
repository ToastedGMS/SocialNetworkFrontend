import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import UserContext from '../Context/userContext';
import UpdateProfileBtn from '../Reusable/UpdateProfileBtn';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UpdateProfile() {
	const { setError } = useContext(ErrorContext);
	const { currentUser } = useContext(UserContext);
	const [usernameVal, setUsernameVal] = useState(currentUser.user.username);
	const [bioVal, setBioVal] = useState(currentUser.user.bio);
	const [profilePicVal, setProfilePicVal] = useState(
		currentUser.user.profilePic
	);

	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === null) {
			setError('Please login first.');
			navigate('/login');
		}
	}, [currentUser, navigate, setError]);
	return (
		<>
			<div style={{ border: '1px solid black' }}>
				<img
					src={profilePicVal}
					alt={`${currentUser.user.username}'s profile picture`}
				/>
				<p>{usernameVal}</p>
				<p>{bioVal}</p>
			</div>

			<form onSubmit={(e) => e.preventDefault()}>
				<label htmlFor="username">Username: </label>
				<input
					type="text"
					name="username"
					id="username"
					value={usernameVal}
					onChange={(e) => setUsernameVal(e.target.value)}
				/>
				<label htmlFor="bio">Bio: </label>
				<input
					type="text"
					name="bio"
					id="bio"
					value={bioVal}
					onChange={(e) => setBioVal(e.target.value)}
				/>
				<label htmlFor="profilePic">Bio: </label>
				<input
					type="text"
					name="profilePic"
					id="profilePic"
					value={profilePicVal}
					onChange={(e) => setProfilePicVal(e.target.value)}
				/>
				<UpdateProfileBtn
					currentUser={currentUser}
					content={{
						username: usernameVal,
						email: currentUser.user.email,
						bio: bioVal,
						profilePic: profilePicVal,
					}}
				/>
			</form>
		</>
	);
}
