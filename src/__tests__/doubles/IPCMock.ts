import { IIpcRenderer } from '../../renderer/preload';
import { Methods } from '../../shared/Constants';
import { Channels } from '../../main/preload';
import IInvoker from '../../shared/domain/IInvoker';

export default class IPCMock implements IIpcRenderer {
  readonly invoker: IInvoker;
  constructor(invoker:IInvoker) {
    this.invoker = invoker;
  }
  invoke(channel: string, id: string, method: Methods, ...args: unknown[]): Promise<unknown> {
    return Promise.resolve(this.invoker.handleRequest(channel, method, ...args));
  }

  on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined {
    return undefined;
  }

  once(channel: string, func: (...args: unknown[]) => void): void {
  }

  sendMessage(channel: Channels, args: unknown[]): void {
  }

}
