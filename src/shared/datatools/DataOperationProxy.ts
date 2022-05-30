import IDataOperationProxy from '../domain/IDataOperationProxy';
import { IDataPointMovement } from '../domain/Interfaces';
import { Methods } from '../Constants';
import IDataOperation from '../domain/IDataOperation';
import { Channels } from '../../main/preload';
import IpcRendererImpl from '../../renderer/DataHandling/IpcRendereImpl';
import { ClientRequestor } from '../domain/ClientRequestor';

export default class DataOperationProxy implements IDataOperationProxy {
  readonly ID: string;

  readonly channel: Channels = 'ipc-data-operation';

  readonly ipc: ClientRequestor;

  constructor(id: string, req: ClientRequestor) {
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

  public async getSource(): Promise<IDataOperation> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    const objectId = this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_GET_SOURCE,
      []
    ) as Promise<string>;

    return new DataOperationProxy(await objectId, this.ipc)
  }

  public async getTarget(): Promise<IDataOperation> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    const objectId = this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_GET_TARGET,
      []
    ) as Promise<string>;
    return new DataOperationProxy(await objectId, this.ipc);
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

  public async setSource(source: IDataOperation): Promise<void> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    const s = <IDataOperationProxy>source;
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_SET_SOURCE,
      await s.getId()
    ) as Promise<void>;
  }

  public async setTarget(target: IDataOperation): Promise<void> {
    if (!this.ipc) return Promise.reject(new Error('IPC not available'));
    const t = <IDataOperationProxy>target;
    return this.ipc.invoke(
      this.channel,
      this.ID,
      Methods.DATA_OPERATION_SET_TARGET,
      await t.getId()
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

  getId(): Promise<string> {
    return Promise.resolve(this.ID)
  }
}
