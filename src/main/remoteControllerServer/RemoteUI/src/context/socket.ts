import React, { Context } from 'react';
import io from 'socket.io-client';

export const remoteSocket = io(<string>'http://localhost:1337', {
  transports: ['websocket'],
});
// @ts-ignore
export const RemoteSocketContext = React.createContext<Context>(remoteSocket);
