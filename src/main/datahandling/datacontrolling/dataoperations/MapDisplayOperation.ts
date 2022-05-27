import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';

export default class MapDisplayOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private targetOperation: IDataOperation;

  constructor(inputOperation: IDataOperation) {
    this.inputOperation = inputOperation;
    this.targetOperation = new IsNullObject();
  }

  getTarget(): IDataOperation {
    return new IsNullObject();
  }

  setTarget(target: IDataOperation): void {}

  getData(): IDataPointMovement[] {
    return this.inputOperation.getData();
  }

  getSource(): IDataOperation {
    return this.inputOperation;
  }

  getType(): string {
    return MapDisplayOperation.name;
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

  setSettings(settings: any[]): boolean {
    return false;
  }

  setSource(source: IDataOperation): void {
    console.log(
      source.getType(),
      ' is connected to:',
      MapDisplayOperation.name
    );
    this.inputOperation = source;
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
