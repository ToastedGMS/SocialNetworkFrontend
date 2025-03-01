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
import NotificationContext from '../Context/notificationContext';
import GuestContext from '../Context/guestContext';
import Thread from './Thread';
import Search from '../Reusable/Search';
import Profile from './Profile';
import Friendships from './Friendships';
import UpdateProfile from './UpdateProfile';
import Logout from './Logout';
const queryClient = new QueryClient();
import { SocketContext, socket } from '../Context/socketContext';
import Notifications from './Notifications';
import style from './styles/App.module.css';

function App() {
	const [currentUser, setCurrentUser] = useState(null);
	const value = { currentUser, setCurrentUser };
	const [error, setError] = useState(null);
	const errorValue = { error, setError };
	const [postVal, setPostVal] = useState(null);
	const postValue = { postVal, setPostVal };
	const [profile, setProfile] = useState(null);
	const profileValue = { profile, setProfile };
	const [notifications, setNotifs] = useState(null);
	const notifValue = { notifications, setNotifs };
	const [isGuest, setIsGuest] = useState(false);
	const guestValue = { isGuest, setIsGuest };

	return (
		<Router>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<nav className={style.container}>
					<ul className={style.ul}>
						{!currentUser && (
							<>
								<li>
									<Link to={'/login'} title="Login">
										<i className="fa-solid fa-right-to-bracket"></i>
									</Link>
								</li>
								<li>
									<Link to={'/signup'} title="Signup">
										<i className="fa-solid fa-user-plus"></i>
									</Link>
								</li>
							</>
						)}
						{currentUser && (
							<>
								<li>
									<Link to={'/home'} title="Home">
										<i className="fa-solid fa-house"></i>
									</Link>
								</li>
								<li>
									<Link
										title="Profile"
										to={`/user/${currentUser.user.username}`}
										onClick={() => setProfile(currentUser.user)}
									>
										<i className="fa-solid fa-user"></i>
									</Link>
								</li>
								<li>
									<Link to={'/friendships'} title="Friendships">
										<i className="fa-solid fa-user-group"></i>
									</Link>
								</li>
								<li>
									<Link
										to={'/notifications'}
										title="Notifications"
										className="notification-link"
										style={{ position: 'relative', display: 'inline-block' }}
									>
										<i className="fa-solid fa-bell"></i>
										{Array.isArray(notifications) &&
											notifications.length > 0 && (
												<span
													style={{
														position: 'absolute',
														top: '-5px',
														right: '-5px',
														backgroundColor: 'red',
														color: 'white',
														fontSize: '.8em',
														width: '18px',
														height: '18px',
														borderRadius: '50%',
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														fontWeight: 'bold',
														padding: '1px',
													}}
												>
													{notifications.length}
												</span>
											)}
									</Link>
								</li>

								<li>
									<Link to={'/logout'} title="Logout">
										<i className="fa-solid fa-right-from-bracket"></i>
									</Link>
								</li>
							</>
						)}
					</ul>
					{currentUser && (
						<div className={style.searchContainer}>
							{' '}
							<Search currentUser={currentUser} setProfile={setProfile} />
						</div>
					)}
				</nav>
				<GuestContext.Provider value={guestValue}>
					<SocketContext.Provider value={{ socket }}>
						<UserContext.Provider value={value}>
							<ErrorContext.Provider value={errorValue}>
								<PostContext.Provider value={postValue}>
									<QueryClientProvider client={queryClient}>
										<ProfileContext.Provider value={profileValue}>
											<NotificationContext.Provider value={notifValue}>
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
													<Route
														path="/notifications"
														element={<Notifications />}
													></Route>
												</Routes>
											</NotificationContext.Provider>
										</ProfileContext.Provider>
									</QueryClientProvider>
								</PostContext.Provider>
							</ErrorContext.Provider>
						</UserContext.Provider>
					</SocketContext.Provider>
				</GuestContext.Provider>
			</div>
		</Router>
	);
}

export default App;
