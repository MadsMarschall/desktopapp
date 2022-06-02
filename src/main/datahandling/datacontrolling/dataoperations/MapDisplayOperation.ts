import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { IOperationMeta } from '../../../../shared/domain/IOperationMetaData';

export default class MapDisplayOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private targetOperation: IDataOperation;
  private readonly id: string;
  private outputData: IDataPointMovement[]=[];
  private settings: unknown[] = [];
  constructor(inputOperation: IDataOperation, id:string) {
    this.id = id;
    this.inputOperation = inputOperation;
    this.targetOperation = new IsNullObject();
  }

  getTarget(): Promise<IDataOperation> {
    return Promise.resolve(this.targetOperation);
  }

  setTarget(target: IDataOperation): Promise<void> {
    this.targetOperation = target;
    return Promise.resolve();
  }

  getData(): Promise<IDataPointMovement[]> {
    return this.inputOperation.getData();
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  getType(): Promise<string> {
    return Promise.resolve(MapDisplayOperation.name);
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
    return Promise.resolve(true);
  }

  setSource(source: IDataOperation): Promise<void> {
    console.log(
      source.getType(),
      ' is connected to:',
      MapDisplayOperation.name
    );
    this.inputOperation = source;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  getId(): Promise<string> {
    return Promise.resolve(this.id);
  }

  getSettings(): Promise<any[]> {
    return Promise.resolve([]);
  }
  async getMetaData(): Promise<IOperationMeta> {
    const result: IOperationMeta = {
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
