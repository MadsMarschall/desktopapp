
import { Socket } from 'socket.io-client';
import { Methods } from '../../../../shared/Constants';
import { Channels } from '../../../preload';
import { ClientRequestor } from '../../../../shared/domain/ClientRequestor';

export default class IpcRemoteSocket implements ClientRequestor {
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
      const callback = (data: unknown) => {
        this.socket.off(id, callback);
        resolve(data);
      };
      this.socket.emit(channel,  id, method, args, callback);
    })
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
