import React, { Context } from 'react';
import io from 'socket.io-client';
import { PHONE_CONTROLLER_BASE_URL } from '../../../../shared/Constants';

export const remoteSocket = io(<string>PHONE_CONTROLLER_BASE_URL, {
  transports: ['websocket'],
});
// @ts-ignore
export const RemoteSocketContext = React.createContext<Context>(remoteSocket);
