
import { Socket } from 'socket.io-client';
import { IIpcRenderer } from '../../../../renderer/preload';
import { Methods } from '../../../../shared/Constants';
import { Channels } from '../../../preload';

export default class IpcRemoteSocket implements IIpcRenderer {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  invoke(
    channel: string,
    id: string,
    method: Methods,
    ...args: unknown[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.socket.emit(channel, { id, method, args }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  on(
    channel: string,
    func: (...args: unknown[]) => void
  ): (() => void) | undefined {
    this.socket.on(channel, func);
    return;
  }

  once(channel: string, func: (...args: unknown[]) => void): void {
    this.socket.once(channel, func);
  }

  sendMessage(channel: Channels, args: unknown[]): void {
    this.socket.emit(channel, args);
  }
}
