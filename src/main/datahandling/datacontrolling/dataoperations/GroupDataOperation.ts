import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';

export default class GroupDataOperation implements IDataOperation {
  private inputOperation: IDataOperation;
  private readonly id: string;
  private readonly outputData: IDataPointMovement[] = [];

  private readonly targetOperation: IDataOperation;
  private settings: unknown[] = [];

  constructor(inputData: IDataOperation,id:string) {
    this.id = id;
    this.inputOperation = inputData;
    this.targetOperation = new IsNullObject();
  }

  getData(): Promise<IDataPointMovement[]> {
    return Promise.resolve(this.outputData);
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

  getId(): Promise<string> {
    return Promise.resolve(this.id);
  }

  getSettings(): Promise<any[]> {
    return Promise.resolve([]);
  }
  async getDisplayableData(): Promise<IDisplayableData> {
    const result: IDisplayableData = {
      entries: this.outputData.length,
      id: this.id,
      name: await this.getType(),
      sourceOperationId: await this.inputOperation.getId(),
      targetOperationId: await this.targetOperation.getId(),
      settings: this.settings
    };
    return Promise.resolve(result);
  }
}
