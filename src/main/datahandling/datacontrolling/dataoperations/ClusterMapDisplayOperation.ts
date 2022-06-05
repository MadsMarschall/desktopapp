import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';

export default class ClusterMapDisplayOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private targetOperation: IDataOperation;
  private readonly id: string;
  private outputData: IDataPointMovement[]=[];
  private settings: unknown[] = [];
  private clusterPosition: any[]= [];
  private entries: number = 0;
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
    this.getDisplayableData().then(data => {
      if(data.entries) {
        this.entries = data.entries;
      }
      if(data.clusterPositions) {
        this.clusterPosition = data.clusterPositions;
      }
    })
    return Promise.resolve();
  }

  getData(): Promise<IDataPointMovement[]> {
    return this.inputOperation.getData();
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  getType(): Promise<string> {
    return Promise.resolve(ClusterMapDisplayOperation.name);
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
      ClusterMapDisplayOperation.name
    );
    this.inputOperation = source;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.getDisplayableData().then(data => {
        if(data.entries) {
          this.entries = data.entries;
        }
        if(data.clusterPositions) {
          this.clusterPosition = data.clusterPositions;
        }
      })
      resolve();
    });
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
