import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Signup() {
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const mutation = useMutation({
		mutationFn: async (data) => {
			const response = await fetch(`${serverUrl}/api/users/new`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Signup failed');
			}
			setFormData({
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
			});
			return response.json();
		},
		onError: (err) => setError(err.message),
		onSuccess: () => {
			alert('Signup Successful!');
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		setError(null);

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		mutation.mutate({
			username: formData.username,
			email: formData.email,
			password: formData.password,
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					name="username"
					id="username"
					value={formData.username}
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							[e.target.name]: e.target.value,
						}));
					}}
					required
				/>
			</div>
			<div>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					name="email"
					id="email"
					value={formData.email}
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							[e.target.name]: e.target.value,
						}));
					}}
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
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							[e.target.name]: e.target.value,
						}));
					}}
					required
				/>
			</div>
			<div>
				<label htmlFor="confirmPassword">Confirm Password:</label>
				<input
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					value={formData.confirmPassword}
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							[e.target.name]: e.target.value,
						}));
					}}
					required
				/>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</div>
			<div>
				<button type="submit" disabled={mutation.isLoading}>
					{mutation.isLoading ? 'Signing up...' : 'Signup'}
				</button>{' '}
			</div>
		</form>
	);
}
