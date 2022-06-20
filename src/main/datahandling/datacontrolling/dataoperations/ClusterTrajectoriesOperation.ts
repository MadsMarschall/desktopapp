import IDataOperation from '../../../../shared/domain/IDataOperation';
import IsNullObject from './IsNullObject';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { IClusterPosition, IDisplayableData } from '../../../../shared/domain/IOperationMetaData';
import { clusterData } from '@greenelab/hclust';
import { euclideanDistance } from '@greenelab/hclust';
import { avgDistance } from '@greenelab/hclust';
import DataPreProcessor from '../../../../datapreprocess/DataPreProcessor';

export default class ClusterTrajectoriesOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private settings: any[] = [0.075, 1, false, 2000];
  private eps: number = 30;
  private minPts: number = 1;
  private useTime: boolean = false;
  private timeEps: number = 2000;
  private clusterPositions: IClusterPosition[] = [];


  private targetOperation: IDataOperation;

  private readonly id: string;

  constructor(inputOperation: IDataOperation, id: string) {
    this.id = id;
    this.targetOperation = new IsNullObject();
    this.inputOperation = inputOperation;
  }

  getSettings(): Promise<any[]> {
    return Promise.resolve(this.settings);
  }

  getData(): Promise<IDataPointMovement[]> {
    return Promise.resolve(this.outputData);
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  getType(): Promise<string> {
    return Promise.resolve(ClusterTrajectoriesOperation.name);
  }

  retriggerOperationChainBackward(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackward();
      await this.inputOperation.triggerOperation();
      resolve();
    });
  }

  retriggerOperationChainForward(): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      await this.triggerOperation();
      await this.targetOperation.retriggerOperationChainForward();
      resolve();
    });
  }

  setSettings(settings: any[]): Promise<boolean> {
    this.settings = settings;
    this.eps = this.settings[0];
    this.minPts = this.settings[1];
    this.useTime = this.settings[2];
    this.timeEps = this.settings[3];
    return Promise.resolve(true);
  }

  setSource(source: IDataOperation): Promise<void> {
    console.log(
      source.getType(),
      ' is connected to:',
      ClusterTrajectoriesOperation.name
    );
    this.inputOperation = source;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const data = await this.inputOperation.getData()
      const trajectories:Array<number[]> = [];
      let currentTrajectory: number[] = [];
      let personId:number = 0;
      for (const row of data) {
        const isNewPerson = row.PersonId !== personId;
        if (isNewPerson) {
          personId = row.PersonId;
          currentTrajectory = [];
          trajectories.push(currentTrajectory);
        }
        if (!row.rideId) break;
        const value = row.rideId.valueOf();
        currentTrajectory.push(value);
      }
      let threshold = 5;
      const { clusters, distances, order, clustersGivenK } = clusterData({data:trajectories});
      console.log(clusters)
    })
  }


  getTarget(): Promise<IDataOperation> {
    return Promise.resolve(this.targetOperation);
  }

  setTarget(target: IDataOperation) : Promise<void> {
    this.targetOperation = target;
    return Promise.resolve();
  }

  getId(): Promise<string> {
    return Promise.resolve(this.id);
  }

  async getDisplayableData(): Promise<IDisplayableData> {
    const result
      :
      IDisplayableData = {
      entries: this.outputData.length,
      id: this.id,
      name: await this.getType(),
      sourceOperationId: await this.inputOperation.getId(),
      targetOperationId: await this.targetOperation.getId(),
      settings: this.settings,
      clusterPositions: this.clusterPositions
    };
    return Promise.resolve(result);
  }
}
