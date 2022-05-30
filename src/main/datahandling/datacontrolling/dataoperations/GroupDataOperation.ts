import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';

export default class GroupDataOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private readonly data: IDataPointMovement[] = [];

  private readonly targetOperation: IDataOperation;

  constructor(inputData: IDataOperation) {
    this.inputOperation = inputData;
    this.targetOperation = new IsNullObject();
  }

  getData(): Promise<IDataPointMovement[]> {
    return Promise.resolve(this.data);
  }

  setSource(source: IDataOperation): Promise<void> {
    this.inputOperation = source;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackward();
      // await tidy(this.inputOperation.getData(),groupBy)
      resolve();
    });
  }

  getType(): Promise<string> {
    return Promise.resolve(GroupDataOperation.name);
  }

  retriggerOperationChainBackward(): Promise<void> {
    return new Promise(async (resolve) => {
      await this.inputOperation.triggerOperation();
      resolve();
    });
  }

  retriggerOperationChainForward(): Promise<void> {
    return new Promise(async (resolve) => {
      await this.triggerOperation();
      await this.targetOperation.retriggerOperationChainForward();
      resolve();
    });
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  setSettings(settings: any[]): Promise<boolean> {
    return Promise.resolve(false);
  }

  getTarget(): Promise<IDataOperation> {
    return Promise.resolve(this.targetOperation);
  }

  setTarget(): Promise<void> {
    return Promise.resolve();
  }
}
