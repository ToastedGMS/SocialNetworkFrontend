import { useEffect, useState } from 'react';
import UserSearchCard from './UserSearchCard';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Search({ currentUser }) {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	async function searchUsers() {
		try {
			setLoading(true);
			const response = await fetch(
				`${serverUrl}/api/users/search?searchQuery=${search}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.error || 'Error fetching users');
			}

			const res = await response.json();
			setResults(res.users);
		} catch (error) {
			console.error('Failed to search users:', error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (search.length > 0) {
			const timer = setTimeout(() => {
				searchUsers();
			}, 500);

			return () => clearTimeout(timer);
		} else {
			setResults([]); // Clear results if search query is too short
		}
	}, [search]);

	return (
		<div>
			<textarea
				name="input"
				id="input"
				cols="80"
				rows="1"
				placeholder="Search for usernames..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				style={{ resize: 'none' }}
			></textarea>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div>
					{results.length > 0 ? (
						<ul>
							{results.map((user) => (
								<UserSearchCard
									key={user.id}
									user={user}
									currentUser={currentUser}
								/>
							))}
						</ul>
					) : (
						<p>No users found</p>
					)}
				</div>
			)}
		</div>
	);
}
