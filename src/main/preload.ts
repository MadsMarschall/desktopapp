import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import DataOperationChainController from './datahandling/datacontrolling/DataOperationChainController';
import DataBaseController from './datahandling/utilities/DataBaseController';
import { Methods, OperationIds, TableNames } from '../shared/Constants';
import { ICSVInputObject } from '../shared/domain/Interfaces';
import DataOperationChainControllerInvoker from './datahandling/invokers/DataOperationChainControllerInvoker';

export type Channels = 'ipc-chain-controller' | 'ipc-data-operation';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, id: string, method: Methods, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, id, method, ...args);
    },
  },
});
