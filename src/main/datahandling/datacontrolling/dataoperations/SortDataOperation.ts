import { arrange, tidy } from '@tidyjs/tidy';
import { IDataPointMovement } from '../../utilities/DataBaseController';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import IsNullObject from './IsNullObject';

export default class SortDataOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[];

  private targetOperation: IDataOperation;

  constructor(inputOperation: IDataOperation) {
    this.inputOperation = inputOperation;
    this.outputData = inputOperation.getData();
    this.targetOperation = new IsNullObject();
  }

  getData(): IDataPointMovement[] {
    return this.outputData;
  }

  setSource(source: IDataOperation): void {
    this.inputOperation = source;
  }

  triggerOperation(): Promise<void> {
    return new Promise(async (resolve) => {
      this.outputData = tidy(
        this.inputOperation.getData(),
        arrange(['Timestamp'])
      );
      resolve();
    });
  }

  retriggerOperationChainBackwards(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackwards();
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

  getType(): string {
    return SortDataOperation.name;
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

  setTarget(target: IDataOperation): void {
    this.targetOperation = target;
  }
}
