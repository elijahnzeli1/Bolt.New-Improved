import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export const joinRoom = (roomId: string): void => {
  socket.emit('join', roomId); // Emit a join event with the specified roomId
}; // Closing brace added here

export const onMessageReceived = (callback: (message: unknown) => void): void => {
  socket.on('message', (message: unknown) => {
    // Call the provided callback with the received message
    if (callback && typeof callback === 'function') {
      callback(message);
    } else {
      console.error('Callback is not a function');
    }
  });
};