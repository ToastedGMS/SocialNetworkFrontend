import React, { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ErrorMessage from '../Reusable/ErrorMessage';
import FormBtn from '../Reusable/FormBtn';
import ErrorContext from '../Context/errorContext';
const serverUrl = import.meta.env.VITE_SERVER_URL;
import style from './styles/Signup.module.css';

export default function Signup() {
	const { error, setError } = useContext(ErrorContext);
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

		const trimmedData = {
			username: formData.username.trim(),
			email: formData.email.trim(),
			password: formData.password.trim(),
		};

		mutation.mutate(trimmedData);
	};

	function handleChange(e) {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	}

	return (
		<div className={style.container}>
			<form className={style.form} onSubmit={handleSubmit}>
				<h1>Signup</h1>
				<div>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						name="username"
						id="username"
						minLength={1}
						value={formData.username}
						onChange={handleChange}
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
						minLength={8}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						required
						minLength={8}
					/>
					{error && <ErrorMessage error={error} />}
				</div>
				<div>
					<FormBtn mutationLoading={mutation.isLoading} formType={'Signup'} />
				</div>
			</form>
		</div>
	);
}
