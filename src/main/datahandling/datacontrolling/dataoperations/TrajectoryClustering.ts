import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { TableNames } from '../../../../shared/Constants';
import IsNullObject from './IsNullObject';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';

export default class TrajectoryClustering implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private settings: string[] | number[] | TableNames[] = [];
  private readonly id: string;

  private targetOperation: IDataOperation;

  constructor(inputOperation: IDataOperation, id: string) {
    this.id = id;
    this.inputOperation = inputOperation;
    this.targetOperation = new IsNullObject();
  }
  getData(): Promise<IDataPointMovement[]> {
    return Promise.resolve(this.outputData);
  }

  getId(): Promise<string> {
    return Promise.resolve(this.id);
  }

  getSettings(): Promise<any[]> {
    return Promise.resolve(this.settings);
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  getTarget(): Promise<IDataOperation> {
    return Promise.resolve(this.targetOperation);
  }

  getType(): Promise<string> {
    return Promise.resolve(TrajectoryClustering.name);
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

  setSettings(settings: any[]): Promise<boolean> {
    return Promise.resolve(false);
  }

  setSource(source: IDataOperation): Promise<void> {
    return Promise.resolve();
  }

  setTarget(target: IDataOperation): Promise<void> {
    this.targetOperation = target;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {

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
