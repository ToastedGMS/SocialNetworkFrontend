import { useEffect, useState } from 'react';
import UserSearchCard from './UserSearchCard';
import { useNavigate } from 'react-router-dom';
const serverUrl = import.meta.env.VITE_SERVER_URL;
import styles from './styles/Search.module.css';

export default function Search({ currentUser, setProfile }) {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

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
			if (
				error.message.includes('No users found') ||
				error.message.includes('GET')
			) {
				return;
			}
			// console.error('Failed to search users:', error);
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
		<div className={styles.container}>
			<textarea
				className={styles.search}
				name="search"
				id="search"
				cols="80"
				rows="1"
				placeholder="Search for usernames..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				style={{ resize: 'none' }}
			></textarea>
			{loading ? (
				<p className={styles.text}>Loading...</p>
			) : (
				<div>
					{results.length > 0 ? (
						<ul className={styles.ul}>
							{results.map((user) => (
								<div
									onClick={() => {
										setProfile(user);
										navigate(`/user/${user.username}`);
										setSearch('');
									}}
									key={user.id}
								>
									<UserSearchCard
										user={user}
										currentUser={currentUser}
										setProfile={setProfile}
									/>
								</div>
							))}
						</ul>
					) : search.trim() ? (
						<p className={styles.text}>No users found.</p>
					) : null}
				</div>
			)}
		</div>
	);
}
