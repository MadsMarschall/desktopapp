import IDataOperation from '../../../../shared/domain/IDataOperation';
import IsNullObject from './IsNullObject';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';

export default class TimeSliderOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[];

  private settings: any[] = [0, 9999999999999];

  private targetOperation: IDataOperation;

  constructor(inputOperation: IDataOperation) {
    this.targetOperation = new IsNullObject();
    this.inputOperation = inputOperation;
    this.outputData = inputOperation.getData();
  }

  getData(): IDataPointMovement[] {
    return this.outputData;
  }

  getSource(): IDataOperation {
    return this.inputOperation;
  }

  getType(): string {
    return TimeSliderOperation.name;
  }

  retriggerOperationChainBackwards(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackwards();
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

  setSettings(settings: any[]): boolean {
    const maxAndMinPresent: boolean = settings.length === 2;
    if (!maxAndMinPresent) return false;
    if (settings.find((e) => typeof e !== 'number')) return false;
    this.settings = settings;
    console.log('Recieved settings:', settings);
    return true;
  }

  setSource(source: IDataOperation): void {
    console.log(
      source.getType(),
      ' is connected to:',
      TimeSliderOperation.name
    );
    this.inputOperation = source;
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      this.outputData = this.inputOperation.getData().filter((e) => {
        const time = e.timestamp.getTime();
        const isLargerThanLowerBound: boolean = time >= this.settings[0];
        const isSmallerThanUpperBound: boolean = time <= this.settings[1];
        return isLargerThanLowerBound && isSmallerThanUpperBound;
      });
      resolve();
    });
  }

  getTarget(): IDataOperation {
    return this.targetOperation;
  }

  setTarget(target: IDataOperation): void {
    this.targetOperation = target;
  }
}
