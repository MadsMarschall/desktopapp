import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';

export default class GroupDataOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private readonly data: IDataPointMovement[];

  private readonly targetOperation: IDataOperation;

  constructor(inputData: IDataOperation) {
    this.inputOperation = inputData;
    this.data = this.inputOperation.getData();
    this.targetOperation = new IsNullObject();
  }

  getData(): IDataPointMovement[] {
    return this.data;
  }

  setSource(source: IDataOperation): void {
    this.inputOperation = source;
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackwards();
      // await tidy(this.inputOperation.getData(),groupBy)
      resolve();
    });
  }

  getType(): string {
    return GroupDataOperation.name;
  }

  retriggerOperationChainBackwards(): Promise<void> {
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

  getSource(): IDataOperation {
    return this.inputOperation;
  }

  setSettings(settings: any[]): boolean {
    return false;
  }

  getTarget(): IDataOperation {
    return this.targetOperation;
  }

  setTarget(): void {}
}
