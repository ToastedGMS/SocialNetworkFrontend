import { createContext } from 'react';
import { io } from 'socket.io-client';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export const socket = io(serverUrl, {
	autoConnect: false,
});
export const SocketContext = createContext();
