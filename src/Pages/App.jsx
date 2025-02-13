import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import UserContext from '../Context/userContext';
import ErrorContext from '../Context/errorContext';
import PostContext from '../Context/postContext';
import ProfileContext from '../Context/profileContext';
import Thread from './Thread';
import Search from '../Reusable/Search';
import Profile from './Profile';
import Friendships from './Friendships';
import UpdateProfile from './UpdateProfile';
import Logout from './Logout';
const queryClient = new QueryClient();
import { SocketContext, socket } from '../Context/socketContext';

function App() {
	const [currentUser, setCurrentUser] = useState(null);
	const value = { currentUser, setCurrentUser };
	const [error, setError] = useState(null);
	const errorValue = { error, setError };
	const [postVal, setPostVal] = useState(null);
	const postValue = { postVal, setPostVal };
	const [profile, setProfile] = useState(null);
	const profileValue = { profile, setProfile };

	// useEffect(() => {
	// 	socket.on('connect', onConnect);
	// 	socket.on('disconnect', onDisconnect);

	// 	return () => {
	// 		socket.off('connect', onConnect);
	// 		socket.off('disconnect', onDisconnect);
	// 	};
	// }, []);

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
						{currentUser && (
							<>
								<li>
									<Link to={'/logout'}>Logout</Link>
								</li>
								<li>
									<Link to={'/home'}>Home</Link>
								</li>
								<li>
									<Link
										to={`/user/${currentUser.user.username}`}
										onClick={() => setProfile(currentUser.user)}
									>
										My Profile
									</Link>
								</li>
								<li>
									<Link to={'/friendships'}>Friendships</Link>
								</li>
								<Search currentUser={currentUser} setProfile={setProfile} />
							</>
						)}
					</ul>
				</nav>
				<SocketContext.Provider value={{ socket }}>
					<UserContext.Provider value={value}>
						<ErrorContext.Provider value={errorValue}>
							<PostContext.Provider value={postValue}>
								<QueryClientProvider client={queryClient}>
									<ProfileContext.Provider value={profileValue}>
										<Routes>
											<Route path="/login" element={<Login />}></Route>
											<Route path="/signup" element={<Signup />}></Route>
											<Route path="/home" element={<Home />}></Route>
											<Route path="/post/:id" element={<Thread />}></Route>
											<Route
												path="/user/:username"
												element={<Profile />}
											></Route>
											<Route
												path="/friendships"
												element={<Friendships />}
											></Route>
											<Route
												path="/user/update"
												element={<UpdateProfile />}
											></Route>
											<Route path="/logout" element={<Logout />}></Route>
										</Routes>
									</ProfileContext.Provider>
								</QueryClientProvider>
							</PostContext.Provider>
						</ErrorContext.Provider>
					</UserContext.Provider>
				</SocketContext.Provider>
			</div>
		</Router>
	);
}

export default App;
