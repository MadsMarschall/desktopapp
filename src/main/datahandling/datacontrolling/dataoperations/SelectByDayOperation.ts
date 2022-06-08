import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import IsNullObject from './IsNullObject';
import { SortBy, TableIndexing, TableNames } from '../../../../shared/Constants';
import { dbController } from '../../utilities/DataBaseController';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';

export default class SelectByDayOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private settings: string[] | number[] | TableNames[] = [TableNames.TEST];
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

  setSource(source: IDataOperation): Promise<void> {
    this.inputOperation = source;
    return Promise.resolve();
  }

  async triggerOperation(): Promise<void> {
    return new Promise(async (resolve,reject) => {
      this.outputData = await dbController.getAllDataFromTable();
      return resolve();
      console.log("loaded data: "+this.outputData.length);
    });
  }
  private findOptimalIndexing(tableName: TableNames): TableIndexing {
    switch (tableName) {
      case TableNames.FRIDAY:
        return TableIndexing.FRIDAY_PersonId_Timestamp;
        break;
      case TableNames.SATURDAY:
        return TableIndexing.SATURDAY_PersonId_Timestamp;
        break;
      case TableNames.SUNDAY:
        return TableIndexing.SUNDAY_PersonId_Timestamp;
        break;
      default:
        throw new Error('No indexing found');
    }
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
    return Promise.resolve(SelectByDayOperation.name);
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  setSettings(settings: any[]): Promise<boolean> {
    if(!settings) return Promise.resolve(false);
    this.settings = settings;
    return Promise.resolve(true);
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

  getSettings(): Promise<any[]> {
    return Promise.resolve(this.settings);
  }

  private verifySettings(): boolean {
    if (this.settings.length < 1) return false;
    return true;
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

  private settingsAreValid() {
    if(!this.settings) return false;
    if(this.settings.length < 1) return false;
    if(this.settings[0]===TableNames.TEST) return false;
    return true;
  }
}
