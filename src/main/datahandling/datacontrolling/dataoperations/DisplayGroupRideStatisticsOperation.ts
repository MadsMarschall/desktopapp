import IDataOperation from '../../../../shared/domain/IDataOperation';
import IsNullObject from './IsNullObject';
import { IDataPointMovement, IRideDataStatistics, IRow } from '../../../../shared/domain/Interfaces';
import { IClusterPosition, IDisplayableData } from '../../../../shared/domain/IOperationMetaData';
import jDBSCAN from './dbscan/DBScan';
import { ChartDataset } from 'chart.js';
import { spawn, Thread,Worker } from 'threads';
import { FilterWorker } from './workers/timeFilterWorker';
import { dbController } from '../../utilities/DataBaseController';


export default class DisplayGroupRideStatisticsOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private settings: any[] = [0,0];

  private targetOperation: IDataOperation;

  private rideDataStatistics: IRideDataStatistics[] = [];

  private readonly id: string;

  constructor(inputOperation: IDataOperation, id: string) {
    this.id = id;
    this.targetOperation = new IsNullObject();
    this.inputOperation = inputOperation;
  }

  async getSettings(): Promise<any[]> {
    return this.settings;
  }

  async getData(): Promise<IDataPointMovement[]> {
    return this.outputData;
  }

  async getSource(): Promise<IDataOperation> {
    return this.inputOperation;
  }

  async getType(): Promise<string> {
    return DisplayGroupRideStatisticsOperation.name;
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
    return Promise.resolve(true);
  }

  setSource(source: IDataOperation): Promise<void> {
    console.log(
      source.getType(),
      ' is connected to:',
      DisplayGroupRideStatisticsOperation.name
    );
    this.inputOperation = source;
    return Promise.resolve();
  }

  async triggerOperation(): Promise<void> {
      await this.inputOperation.getSettings().then(async (settings) => {
        if ((await this.inputOperation.getSettings()).length < 2) return;
        let ids = "";
        ((await this.inputOperation.getSettings())[1]).forEach((row: IRow) => {
          ids += row.members + ",";
        })
        ids = ids.slice(0, ids.length - 2);
        let query = `SELECT rideId,count(rideId) AS countOfRideEntries FROM parkmovementFinal where PersonId in ( ${ids} ) group by rideId`
        await dbController.execute<IRideDataStatistics[]>(query, []).then((data: IRideDataStatistics[]) => {
          this.rideDataStatistics = data.filter((row: IRideDataStatistics) => row.rideId != -99);
        })
      })
  }

  getTarget(): Promise<IDataOperation> {
    return Promise.resolve(this.targetOperation);
  }

  setTarget(target: IDataOperation): Promise<void> {
    this.targetOperation = target;
    return Promise.resolve();
  }

  getId(): Promise<string> {
    return Promise.resolve(this.id);
  }

  async getDisplayableData(): Promise<IDisplayableData> {
    const result: IDisplayableData = {
      entries: this.outputData.length,
      id: this.id,
      name: await this.getType(),
      sourceOperationId: await this.inputOperation.getId(),
      targetOperationId: await this.targetOperation.getId(),
      settings: this.settings,
      rideDataStatistics: this.rideDataStatistics,
      clusterPositions: (await this.inputOperation.getDisplayableData()).clusterPositions || undefined,
    };
    return Promise.resolve(result);
  }
}
