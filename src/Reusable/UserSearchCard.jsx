import { useEffect, useState } from 'react';

export default function UserSearchCard({ user, currentUser }) {
	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img
					src={user.profilePic}
					alt="User profile picture"
					style={{ width: '2em', borderRadius: '50%' }}
				/>
				<p style={{ marginLeft: '10px' }}>{user.username}</p>
			</div>
		</>
	);
}
