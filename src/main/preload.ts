import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Methods } from '../shared/Constants';


export type Channels = 'ipc-chain-controller' | 'ipc-data-operation';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, args: unknown[]) =>
        func(args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, args) => func(...args));
    },
    invoke(channel: Channels, id: string, method: Methods, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, id, method, args);
    },
  },
});
