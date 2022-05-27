import IDataOperationProxy from '../../shared/domain/IDataOperationProxy';
import { IDataPointMovement } from '../../shared/domain/Interfaces';
import { Methods } from '../../shared/Constants';
import IDataOperation from '../../shared/domain/IDataOperation';
import { Channels } from '../../main/preload';

export default class DataOperationProxy implements IDataOperationProxy {
  readonly ID: string;

  constructor(id: string) {
    this.ID = id;
  }

  public getData(): IDataPointMovement[] {
    let data: any;
    (async () => {
      data = await window.electron.ipcRenderer.invoke(
        'ipc-data-operation',
        this.ID,
        Methods.DATA_OPERATION_GET_DATA,
        []
      );
    })();
    return data;
  }

  public getSource(): IDataOperation {
    let source: any;
    (async () => {
      source = await window.electron.ipcRenderer.invoke(
        'ipc-data-operation',
        this.ID,
        Methods.DATA_OPERATION_GET_SOURCE,
        []
      );
    })();
    return source;
  }

  public getTarget(): IDataOperation {
    let target: any;
    (async () => {
      target = await window.electron.ipcRenderer.invoke(
        'ipc-data-operation',
        this.ID,
        Methods.DATA_OPERATION_GET_TARGET,
        []
      );
    })();
    return target;
  }

  public getType(): string {
    let type: any;
    (async () => {
      type = await window.electron.ipcRenderer.invoke(
        'ipc-data-operation',
        this.ID,
        Methods.DATAOPERATION_GET_TYPE,
        []
      );
    })();
    return type;
  }

  public retriggerOperationChainBackwards(): Promise<void> {
    return window.electron.ipcRenderer.invoke(
      'ipc-data-operation',
      this.ID,
      Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD,
      []
    ) as Promise<void>;
  }

  public retriggerOperationChainForward(): Promise<void> {
    return window.electron.ipcRenderer.invoke(
      'ipc-data-operation',
      this.ID,
      Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD,
      []
    ) as Promise<void>;
  }

  public setSettings(settings: any[]): boolean {
    let result: any;
    (async () => {
      result = window.electron.ipcRenderer.invoke(
        'ipc-data-operation',
        this.ID,
        Methods.DATA_OPERATION_SET_SETTINGS,
        settings
      );
    })();
    return result;
  }

  public setSource(source: IDataOperation): void {
    const s = <IDataOperationProxy>source;
    const f = async () => {
      await window.electron.ipcRenderer.invoke(
        'ipc-data-operation',
        this.ID,
        Methods.DATA_OPERATION_SET_SOURCE,
        s.getId()
      );
    };
    f();
  }

  public setTarget(target: IDataOperation): void {
    const t = <IDataOperationProxy>target;
    let result;
    const f = async () => {
      result = await window.electron.ipcRenderer.invoke(
        'ipc-data-operation',
        this.ID,
        Methods.DATA_OPERATION_SET_SOURCE,
        t.getId()
      );
    };
    f();
    return result;
  }

  triggerOperation(): Promise<void> {
    return window.electron.ipcRenderer.invoke(
      'ipc-data-operation',
      this.ID,
      Methods.DATA_OPERATION_TRIGGER_OPERATION
    ) as Promise<void>;
  }

  getId(): string {
    return this.ID;
  }
}
