import React, { Context } from 'react';
import io from 'socket.io-client';

export const remoteSocket = io(<string>'http://settings-controller.local', {
  transports: ['websocket'],
});
// @ts-ignore
export const RemoteSocketContext = React.createContext<Context>(remoteSocket);
