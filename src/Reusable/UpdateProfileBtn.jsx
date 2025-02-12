import { useUpdateProfile } from '../Hooks/useUpdateProfile';

export default function UpdateProfileBtn({ content, currentUser }) {
	const { mutate: updateProfile } = useUpdateProfile();
	const { username, email, bio, profilePic } = content;
	return (
		<button
			onClick={() => {
				updateProfile({
					username,
					email,
					bio,
					profilePic,
					user: currentUser,
				});
			}}
		>
			Update
		</button>
	);
}
