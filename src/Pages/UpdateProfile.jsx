import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import UserContext from '../Context/userContext';
import UpdateProfileBtn from '../Reusable/UpdateProfileBtn';
import ErrorMessage from '../Reusable/ErrorMessage';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UpdateProfile() {
	const { setError } = useContext(ErrorContext);
	const { currentUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser?.user?.id) {
			setError('Please login first.');
			navigate('/login');
			return;
		}
	}, [currentUser, navigate, setError]);

	const [usernameVal, setUsernameVal] = useState(currentUser.user.username);
	const [bioVal, setBioVal] = useState(currentUser.user.bio);
	const [profilePicVal, setProfilePicVal] = useState(
		currentUser.user.profilePic
	);
	const [isValidPic, setIsValidPic] = useState(true); // Track image validity

	// Function to check if the image URL is valid
	const isValidImage = (url) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = url;
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
		});
	};

	// Handle image validation when URL changes
	useEffect(() => {
		if (profilePicVal) {
			isValidImage(profilePicVal).then(setIsValidPic);
		}
	}, [profilePicVal]);

	// Disable the update button if username is empty
	const isFormValid = usernameVal.trim() !== '';

	return (
		<>
			<div style={{ border: '1px solid black' }}>
				{isValidPic ? (
					<img src={profilePicVal} alt={`${usernameVal}'s profile picture`} />
				) : (
					<p>Invalid image URL</p>
				)}
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

				<label htmlFor="profilePic">Profile Picture URL: </label>
				<input
					type="text"
					name="profilePic"
					id="profilePic"
					value={profilePicVal}
					onChange={(e) => setProfilePicVal(e.target.value)}
				/>
				{!isValidPic && <ErrorMessage error={'Invalid image URL'} />}

				{isValidPic && isFormValid && (
					<UpdateProfileBtn
						currentUser={currentUser}
						content={{
							username: usernameVal,
							email: currentUser.user.email,
							bio: bioVal,
							profilePic: isValidPic ? profilePicVal : '',
						}}
					/>
				)}

				{/* Show error if username is empty */}
				{!isFormValid && <ErrorMessage error={'Username cannot be empty!'} />}
			</form>
		</>
	);
}
