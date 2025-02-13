import { useMutation, useQueryClient } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const updateProfile = async ({ username, email, bio, profilePic, user }) => {
	const response = await fetch(
		`${serverUrl}/api/users/update/${user.user.id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
			body: JSON.stringify({ username, email, bio, profilePic }),
		}
	);
	if (!response.ok) {
		const res = await response.json();
		throw new Error(res.message || `Failed to update the user`);
	}

	const res = await response.json();
	return res;
};

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProfile,
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
		// onError: (error) => {
		// 	console.error('Error updating profile:', error.message);
		// },
	});
}
