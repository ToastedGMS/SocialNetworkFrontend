import { useContext, useEffect } from 'react';
import UserContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		setCurrentUser(null);
		navigate('/login');
	}, [currentUser, setCurrentUser]);

	return null;
}
