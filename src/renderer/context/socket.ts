import React, { Context } from 'react';
import io from 'socket.io-client';

export const socket = io(<string>'http://localhost:1337', {
  transports: ['websocket'],
});
// @ts-ignore
export const SocketContext = React.createContext<Context>(socket);
