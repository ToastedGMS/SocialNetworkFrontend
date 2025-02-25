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
	const [isValidPic, setIsValidPic] = useState(true);

	const [file, setFile] = useState(null);
	const [uploadResponse, setUploadResponse] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	useEffect(() => {
		if (uploadResponse) {
			setProfilePicVal(uploadResponse.fileUrl);
		}
	}, [uploadResponse]);

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch(`${serverUrl}/upload`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Error response:', errorText);
				return;
			}

			const result = await response.json();
			setUploadResponse(result);
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const isFormValid = usernameVal.trim() !== '';

	return (
		<>
			<div style={{ border: '1px solid black' }}>
				<img src={profilePicVal} alt={`${usernameVal}'s profile picture`} />
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

				<label htmlFor="profilePic">Profile Picture: </label>
				<input type="file" onChange={handleFileChange} />
				<button onClick={handleUpload}>Upload</button>

				{uploadResponse && (
					<div>
						<p>{uploadResponse.message}</p>
						<p>Image preview:</p>
						<img
							src={uploadResponse.fileUrl}
							alt="Uploaded preview"
							width={'200px'}
						/>
					</div>
				)}

				{isValidPic && isFormValid && (
					<UpdateProfileBtn
						currentUser={currentUser}
						content={{
							username: usernameVal,
							email: currentUser.user.email,
							bio: bioVal,
							profilePic: profilePicVal,
						}}
					/>
				)}

				{!isFormValid && <ErrorMessage error={'Username cannot be empty!'} />}
			</form>
		</>
	);
}
