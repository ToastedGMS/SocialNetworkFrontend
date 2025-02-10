import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import UserContext from '../Context/userContext';
import ErrorContext from '../Context/errorContext';
import PostContext from '../Context/postContext';
import Thread from './Thread';
import Search from '../Reusable/Search';
const queryClient = new QueryClient();

function App() {
	const [currentUser, setCurrentUser] = useState(null);
	const value = { currentUser, setCurrentUser };
	const [error, setError] = useState(null);
	const errorValue = { error, setError };
	const [postVal, setPostVal] = useState(null);
	const postValue = { postVal, setPostVal };

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
						<li>
							<Link to={'/home'}>Home</Link>
						</li>
					</ul>
					<Search currentUser={currentUser} />
				</nav>

				<UserContext.Provider value={value}>
					<ErrorContext.Provider value={errorValue}>
						<PostContext.Provider value={postValue}>
							<QueryClientProvider client={queryClient}>
								<Routes>
									<Route path="/login" element={<Login />}></Route>
									<Route path="/signup" element={<Signup />}></Route>
									<Route path="/home" element={<Home />}></Route>
									<Route path="/post/:id" element={<Thread />}></Route>
								</Routes>
							</QueryClientProvider>
						</PostContext.Provider>
					</ErrorContext.Provider>
				</UserContext.Provider>
			</div>
		</Router>
	);
}

export default App;
