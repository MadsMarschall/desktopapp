import { Methods } from '../../shared/Constants';
import { Channels } from '../../main/preload';
import { ClientRequestor } from '../../shared/domain/ClientRequestor';

export default class IpcRendererImpl implements ClientRequestor {
  invoke(
    channel: string,
    id: string,
    method: Methods,
    ...args: unknown[]
  ): Promise<unknown> {
    return window.electron.ipcRenderer.invoke(channel, id, method, ...args);
  }

  on(
    channel: string,
    func: (...args: unknown[]) => void
  ): (() => void) | undefined {
    return window.electron.ipcRenderer.on(channel, func);
  }

  once(channel: string, func: (...args: unknown[]) => void): void {
    window.electron.ipcRenderer.once(channel, func);
  }

  sendMessage(channel: Channels, args: unknown[]): void {
    window.electron.ipcRenderer.sendMessage(channel, args);
  }
}
