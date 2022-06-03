import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';

export default class IsNullObject implements IDataOperation {
  getSettings(): Promise<any[]> {
      return Promise.resolve([])
  }
  getId(): Promise<string> {
      return Promise.resolve('IsNullObject');
  }
  getData(): Promise<IDataPointMovement[]> {
    return Promise.resolve([]);
  }

  getType(): Promise<string> {
    return Promise.resolve(IsNullObject.name);
  }

  retriggerOperationChainBackward(): Promise<void> {
    return Promise.resolve(undefined);
  }

  retriggerOperationChainForward(): Promise<void> {
    return Promise.resolve(undefined);
  }

  setSource(source: IDataOperation): Promise<void> {
    return Promise.resolve(undefined);
  }

  triggerOperation(): Promise<void> {
    return Promise.resolve(undefined);
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(new IsNullObject());
  }

  setSettings(settings: any[]): Promise<boolean> {
    return Promise.resolve(false);
  }

  getTarget(): Promise<IDataOperation> {
    return Promise.resolve(new IsNullObject());
  }

  setTarget(): Promise<void> {
    return Promise.resolve(undefined);
  }
  async getDisplayableData(): Promise<IDisplayableData> {
    const result: IDisplayableData = {
      entries: 0,
      id: "IsNullObject",
      name: await this.getType(),
      sourceOperationId: "IsNullObject",
      targetOperationId: "IsNullObject",
      settings: []
    };
    return Promise.resolve(result);
  }
}
