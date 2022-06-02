import IDataOperationProxy from '../../shared/domain/IDataOperationProxy';
import { IDataPointMovement } from '../../shared/domain/Interfaces';
import IDataOperation from '../../shared/domain/IDataOperation';
import { IOperationMeta } from '../../shared/domain/IOperationMetaData';

export default class DataOperationErrorObject implements IDataOperationProxy {
  getData(): Promise<IDataPointMovement[]> {
    return Promise.reject(new Error('Error'));
  }

  getId(): Promise<string> {
    return Promise.reject(new Error('Error'));
  }

  getSource(): Promise<IDataOperation> {
    return Promise.reject(new Error('Error'));
  }

  getTarget(): Promise<IDataOperation> {
    return Promise.reject(new Error('Error'));
  }

  getType(): Promise<string> {
    return Promise.reject(new Error('Error'));
  }

  retriggerOperationChainBackward(): Promise<void> {
    return Promise.reject(new Error('Error'));
  }

  retriggerOperationChainForward(): Promise<void> {
    return Promise.reject(new Error('Error'));
  }

  setSettings(settings: any[]): Promise<boolean> {
    return Promise.reject(new Error('Error'));
  }

  setSource(source: IDataOperation): Promise<void> {
    return Promise.reject(new Error('Error'));
  }

  setTarget(target: IDataOperation): Promise<void> {
    return Promise.reject(new Error('Error'));
  }

  triggerOperation(): Promise<void> {
    return Promise.reject(new Error('Error'));
  }

  getSettings(): Promise<any[]> {
    return Promise.resolve([]);
  }

  getMetaData(): Promise<IOperationMeta> {
    return Promise.reject(new Error('Error'));
  }
}
