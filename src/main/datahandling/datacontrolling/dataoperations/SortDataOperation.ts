import { arrange, tidy } from '@tidyjs/tidy';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import IsNullObject from './IsNullObject';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';

export default class SortDataOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private targetOperation: IDataOperation;

  private readonly id: string;
  private settings: unknown[] = [];
  constructor(inputOperation: IDataOperation, id:string) {
    this.id = id;
    this.inputOperation = inputOperation;
    this.targetOperation = new IsNullObject();
  }

  getSettings(): Promise<any[]> {
        throw new Error('Method not implemented.');
    }

  getId(): Promise<string> {
        return Promise.resolve(this.id);
    }

  getData(): Promise<IDataPointMovement[]> {
    return Promise.resolve(this.outputData);
  }

  setSource(source: IDataOperation): Promise<void> {
    this.inputOperation = source;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise(async (resolve) => {
      this.outputData = tidy(
        await this.inputOperation.getData(),
        arrange(['Timestamp'])
      );
      resolve();
    });
  }

  retriggerOperationChainBackward(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackward();
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

  getType(): Promise<string> {
    return Promise.resolve(SortDataOperation.name);
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

  setTarget(target: IDataOperation): Promise<void> {
    this.targetOperation = target;
    return Promise.resolve();
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
