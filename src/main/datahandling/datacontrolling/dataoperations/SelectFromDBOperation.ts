import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import IsNullObject from './IsNullObject';
import { TableNames } from '../../../../shared/Constants';
import { dbController } from '../../utilities/DataBaseController';

export default class SelectFromDBOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[];

  private settings: string[] | number[] | TableNames[] = [];

  private targetOperation: IDataOperation;

  constructor(inputOperation: IDataOperation) {
    this.inputOperation = inputOperation;
    this.outputData = inputOperation.getData();
    this.targetOperation = new IsNullObject();
  }

  getData(): IDataPointMovement[] {
    return this.outputData;
  }

  setSource(source: IDataOperation): void {
    this.inputOperation = source;
  }

  triggerOperation(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.settings.length !== 2) return resolve();
      this.outputData = await dbController.getDataByPersonId(
        <TableNames>this.settings[0],
        <number>this.settings[1]
      );
      console.log(
        SelectFromDBOperation.name,
        'triggerOperation',
        this.outputData
      );
      resolve();
    });
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

  getType(): string {
    return SelectFromDBOperation.name;
  }

  getSource(): IDataOperation {
    return this.inputOperation;
  }

  setSettings(settings: string[] | number[]): boolean {
    if (settings.length != 2) return false;
    if (typeof settings[0] !== typeof TableNames.TEST) return false;
    if (typeof settings[1] !== 'number') return false;
    this.settings = settings;
    return true;
  }

  getTarget(): IDataOperation {
    return this.targetOperation;
  }

  setTarget(target: IDataOperation): void {
    this.targetOperation = target;
  }
}
