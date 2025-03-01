import { useContext, useEffect } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import GuestContext from '../Context/guestContext';

export default function Logout() {
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const { setIsGuest } = useContext(GuestContext);
	const navigate = useNavigate();

	useEffect(() => {
		setCurrentUser(null);
		setIsGuest(false);
		navigate('/login');
	}, [currentUser, setCurrentUser]);

	return null;
}
