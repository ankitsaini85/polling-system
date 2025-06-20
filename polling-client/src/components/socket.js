import { io } from 'socket.io-client';

const socket = io('https://polling-system-wkyf.onrender.com', {
  transports: ['websocket'],
  withCredentials: true
});

export default socket;
