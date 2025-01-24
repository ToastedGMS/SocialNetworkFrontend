import React, { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;
import UserContext from '../Context/userContext';
import ErrorMessage from '../Reusable/ErrorMessage';
import FormBtn from '../Reusable/FormBtn';

export default function Login() {
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		identification: '',
		password: '',
	});

	const mutation = useMutation({
		mutationFn: async (data) => {
			const response = await fetch(`${serverUrl}/api/users/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Login failed');
			}
			setFormData({
				identification: '',
				password: '',
			});
			const resolvedResponse = await response.json();

			setCurrentUser({
				user: resolvedResponse.authorizedUser,
				token: resolvedResponse.token,
			});
			return resolvedResponse;
		},
		onError: (err) => {
			setError(err.message);
		},
		onSuccess: () => {
			alert('User logged in');
			console.log('user', currentUser);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		setError(null);

		mutation.mutate({
			identification: formData.identification,
			password: formData.password,
		});
	};

	function handleChange(e) {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="identification">Username or email:</label>
				<input
					type="text"
					name="identification"
					id="identification"
					value={formData.identification}
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					name="password"
					id="password"
					value={formData.password}
					onChange={handleChange}
					required
				/>
				{error && <ErrorMessage error={error} />}
			</div>
			<div>
				<FormBtn mutationLoading={mutation.isLoading} formType={'Login'} />
			</div>
		</form>
	);
}
