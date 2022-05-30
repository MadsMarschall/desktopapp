import IDataOperationProxy from '../../shared/domain/IDataOperationProxy';
import { IDataPointMovement } from '../../shared/domain/Interfaces';
import { Methods } from '../../shared/Constants';
import IDataOperation from '../../shared/domain/IDataOperation';
import { Channels } from '../../main/preload';
import { IIpcRenderer } from '../preload';
import IpcRendererImpl from './IpcRendereImpl';

export default class DataOperationProxy implements IDataOperationProxy {
  readonly ID: string;

  readonly channel: Channels = 'ipc-data-operation';

  readonly ipc: IIpcRenderer;

  constructor(id: string, req: IIpcRenderer) {
    this.ID = id;
    this.ipc = req;
  }

  public getData(): Promise<IDataPointMovement[]> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_GET_DATA,
      []
    ) as Promise<IDataPointMovement[]>;
  }

  public getSource(): Promise<IDataOperation> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_GET_SOURCE,
      []
    ) as Promise<IDataOperation>;
  }

  public getTarget(): Promise<IDataOperation> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_GET_TARGET,
      []
    ) as Promise<IDataOperation>;
  }

  public getType(): Promise<string> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATAOPERATION_GET_TYPE,
      []
    ) as Promise<string>;
  }

  public retriggerOperationChainBackward(): Promise<void> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD,
      []
    ) as Promise<void>;
  }

  public retriggerOperationChainForward(): Promise<void> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD,
      []
    ) as Promise<void>;
  }

  public setSettings(settings: any[]): Promise<boolean> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_SET_SETTINGS,
      ...settings
    ) as Promise<boolean>;
  }

  public setSource(source: IDataOperation): Promise<void> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    const s = <IDataOperationProxy>source;
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_SET_SOURCE,
      s.getId()
    ) as Promise<void>;
  }

  public setTarget(target: IDataOperation): Promise<void> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    const t = <IDataOperationProxy>target;
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_SET_TARGET,
      t.getId()
    ) as Promise<void>;
  }

  triggerOperation(): Promise<void> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_TRIGGER_OPERATION,
      []
    ) as Promise<void>;
  }

  getId(): string {
    return this.ID;
  }
}
