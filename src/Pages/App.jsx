import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from './Signup';
import Login from './Login';
import UserContext from '../Context/userContext';
const queryClient = new QueryClient();

function App() {
	const [currentUser, setCurrentUser] = useState(null);
	const value = { currentUser, setCurrentUser };

	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to={'/login'}>Login</Link>
						</li>
						<li>
							<Link to={'/signup'}>Signup</Link>
						</li>
					</ul>
				</nav>

				<UserContext.Provider value={value}>
					<QueryClientProvider client={queryClient}>
						<Routes>
							<Route path="/login" element={<Login />}></Route>
							<Route path="/signup" element={<Signup />}></Route>
						</Routes>
					</QueryClientProvider>
				</UserContext.Provider>
			</div>
		</Router>
	);
}

export default App;
