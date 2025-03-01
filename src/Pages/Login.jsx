import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
const serverUrl = import.meta.env.VITE_SERVER_URL;
import UserContext from '../Context/userContext';
import ErrorMessage from '../Reusable/ErrorMessage';
import FormBtn from '../Reusable/FormBtn';
import { useNavigate } from 'react-router-dom';
import ErrorContext from '../Context/errorContext';
import style from './styles/Login.module.css';
import GuestContext from '../Context/guestContext';

export default function Login() {
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const { error, setError } = useContext(ErrorContext);
	const [formData, setFormData] = useState({
		identification: '',
		password: '',
	});
	const navigate = useNavigate();

	const { isGuest, setIsGuest } = useContext(GuestContext);

	useEffect(() => {
		if (isGuest) {
			setCurrentUser({
				user: {
					id: 9999999999999,
					email: 'guest@example.com',
					username: 'guest',
					bio: null,
					profilePic: '/default-profile-image.png',
				},
			});
		}
	}, [isGuest]);

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

			await setCurrentUser({
				user: resolvedResponse.authorizedUser,
				token: resolvedResponse.token,
			});
			return resolvedResponse;
		},
		onError: (err) => {
			setError(err.message);
		},
		onSuccess: () => {
			setError(null);
			navigate('/home');
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
		<div className={style.container}>
			<form className={style.form} onSubmit={handleSubmit}>
				<h1>Login</h1>
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
						minLength={8}
					/>
					{error && <ErrorMessage error={error} />}
				</div>
				<div>
					<FormBtn mutationLoading={mutation.isLoading} formType={'Login'} />
				</div>
				<p style={{ marginTop: '0' }}>Or</p>
				<button
					onClick={() => {
						setIsGuest(true);
						navigate('/home');
					}}
				>
					Login as Guest
				</button>
			</form>
		</div>
	);
}
