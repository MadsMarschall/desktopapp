import IDataOperation from '../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../shared/domain/Interfaces';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import IDataOperationProxy from '../../shared/domain/IDataOperationProxy';
import { IDisplayableData } from '../../shared/domain/IOperationMetaData';

export default class DataOperationSpy implements IDataOperationProxy {
  public spyStorage: unknown[];

  public id: string = '';
  private outputData: IDataPointMovement[];

  constructor(spyStorage: unknown[]) {
    this.outputData = [];
    this.spyStorage = spyStorage;
  }

  getDisplayableData(): Promise<IDisplayableData> {
    this.spyStorage.push(this.getDisplayableData.name);
    let meta: IDisplayableData = {
      entries: 0, id: '', name: '', settings: [], sourceOperationId: '', targetOperationId: ''
    }
    return Promise.resolve(meta);

    }

  getData(): Promise<IDataPointMovement[]> {
    this.spyStorage.push(this.getData.name);
    return Promise.resolve(this.outputData);
  }

  getSource(): Promise<IDataOperation> {
    this.spyStorage.push(this.getSource.name);
    return Promise.resolve(this);
  }

  getTarget(): Promise<IDataOperation> {
    this.spyStorage.push(this.getTarget.name);
    return Promise.resolve(this);
  }

  getType(): Promise<string> {
    this.spyStorage.push(this.getType.name);
    return Promise.resolve('');
  }

  retriggerOperationChainBackward(): Promise<void> {
    this.spyStorage.push(this.retriggerOperationChainBackward.name);
    return Promise.resolve(undefined);
  }

  retriggerOperationChainForward(): Promise<void> {
    this.spyStorage.push(this.retriggerOperationChainForward.name);
    return Promise.resolve(undefined);
  }

  setSettings(settings: any[]): Promise<boolean> {
    this.spyStorage.push(this.setSettings.name);
    return Promise.resolve(true);
  }

  setSource(source: IDataOperation): Promise<void> {
    this.spyStorage.push(this.setSource.name);
    return Promise.resolve(undefined);
  }

  setTarget(target: IDataOperation): Promise<void> {
    this.spyStorage.push(this.setTarget.name);
    return Promise.resolve(undefined);
  }

  triggerOperation(): Promise<void> {
    this.spyStorage.push(this.triggerOperation.name);
    return Promise.resolve(undefined);
  }

  getId(): Promise<string> {
    this.spyStorage.push(this.getId.name);
    return Promise.resolve(this.id);
  }

  public setId(id: string): void {
    this.id = id;
  }

  getSettings(): Promise<any[]> {
    this.spyStorage.push(this.getSettings.name);
    return Promise.resolve([]);
  }

  setData(data: IDataPointMovement[]) {
    this.outputData = data;

  }
}
