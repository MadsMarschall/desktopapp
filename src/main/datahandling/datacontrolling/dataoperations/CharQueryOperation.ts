import IDataOperation from '../../../../shared/domain/IDataOperation';
import IsNullObject from './IsNullObject';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { IClusterPosition, IDisplayableData } from '../../../../shared/domain/IOperationMetaData';
import jDBSCAN from './dbscan/DBScan';
import { ChartDataset } from 'chart.js';

export default class CharQueryOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private settings: any[] = [0.075, 1, false, 2000];
  private filteredData
  private charjsData: ChartDataset[] = [];

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
    return Promise.resolve(CharQueryOperation.name);
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
      CharQueryOperation.name
    );
    this.inputOperation = source;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      let xAxis:string = this.settings[0]
      let yAxis:string = this.settings[1]
      await this.inputOperation.getData().then((data) => {
        let grouping = data.reduce( function(hash) {
          return function(r:any[], o) {
            if (!hash[o[xAxis]]) {
              hash[o[xAxis]] = [];
              r.push(hash[o[xAxis]]);
            }
            hash[o[xAxis]].push(o[yAxis]);
            return r;
          };
        }(Object.create(null)), []);
      })
      resolve();
    });
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
      clusterPositions: (await this.inputOperation.getDisplayableData()).clusterPositions || undefined
    };
    return Promise.resolve(result);
  }
}
