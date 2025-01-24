import React from 'react';

export default function FormBtn({ mutationLoading, formType }) {
	const buttonText = mutationLoading
		? formType === 'Signup'
			? 'Signing up...'
			: 'Logging in...'
		: formType;

	return (
		<button type="submit" disabled={mutationLoading}>
			{buttonText}
		</button>
	);
}
