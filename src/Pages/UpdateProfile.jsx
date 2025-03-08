import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import UserContext from '../Context/userContext';
import UpdateProfileBtn from '../Reusable/UpdateProfileBtn';
import ErrorMessage from '../Reusable/ErrorMessage';
import style from './styles/UpdateProfile.module.css';
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
		const handleFileChange = async (e) => {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);

			if (!selectedFile) return;

			const formData = new FormData();
			formData.append('file', selectedFile);

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
				setProfilePicVal(result.fileUrl); // Update profile picture instantly
			} catch (error) {
				console.error('Error uploading file:', error);
			}
		};
	};

	useEffect(() => {
		if (uploadResponse) {
			setProfilePicVal(uploadResponse.fileUrl);
		}
	}, [uploadResponse]);

	const isFormValid = usernameVal.trim() !== '';

	return (
		<>
			<div className={style.currentProfile}>
				<img src={profilePicVal} alt={`${usernameVal}'s profile picture`} />
				<p>{usernameVal}</p>
				<p>{bioVal}</p>
			</div>

			<div className={style.container}>
				<form className={style.form} onSubmit={(e) => e.preventDefault()}>
					<label htmlFor="username">Username: </label>
					<input
						type="text"
						name="username"
						id="username"
						value={usernameVal}
						minLength={1}
						maxLength={64}
						onChange={(e) => setUsernameVal(e.target.value)}
					/>

					<label htmlFor="bio">Bio: </label>
					<input
						type="text"
						name="bio"
						id="bio"
						value={bioVal}
						maxLength={240}
						onChange={(e) => setBioVal(e.target.value)}
					/>

					<label htmlFor="profilePic">Profile Picture: </label>
					<input
						type="file"
						onChange={handleFileChange}
						accept="image/png, image/gif, image/jpeg, image/jpg"
					/>

					{uploadResponse && (
						<div>
							<p>{uploadResponse.message}</p>
							<p>Image preview:</p>
							<img
								src={uploadResponse.fileUrl}
								alt="Uploaded preview"
								width={'200px'}
								style={{ display: 'block', margin: '1em auto' }}
							/>
						</div>
					)}

					{isValidPic && isFormValid && (
						<UpdateProfileBtn
							currentUser={currentUser}
							content={{
								username: usernameVal.trim(),
								email: currentUser.user.email.trim(),
								bio: bioVal.trim(),
								profilePic: profilePicVal,
							}}
						/>
					)}

					{!isFormValid && <ErrorMessage error={'Username cannot be empty!'} />}
				</form>
			</div>
		</>
	);
}
