import { useNavigate } from 'react-router-dom';
import { useUpdateProfile } from '../Hooks/useUpdateProfile';
import { useState, useEffect } from 'react';

export default function UpdateProfileBtn({ content, currentUser }) {
	const { mutate: updateProfile, isSuccess } = useUpdateProfile();
	const { username, email, bio, profilePic } = content;
	const [responseOk, setResponseOk] = useState(false);
	const navigate = useNavigate();

	function handleUpdate() {
		updateProfile({
			username,
			email,
			bio,
			profilePic,
			user: currentUser,
		});
	}

	useEffect(() => {
		if (isSuccess) {
			setResponseOk(true);
			setTimeout(() => {
				navigate('/logout');
			}, 5000);
		}
	}, [isSuccess]);

	return (
		<>
			<button onClick={handleUpdate}>Update</button>
			{responseOk && (
				<p>
					Profile updated successfully! Please login again for the changes to
					take effect!
				</p>
			)}
		</>
	);
}
