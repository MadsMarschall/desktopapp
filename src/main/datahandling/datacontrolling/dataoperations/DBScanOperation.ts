import IDataOperation from '../../../../shared/domain/IDataOperation';
import IsNullObject from './IsNullObject';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import { IOperationMeta } from '../../../../shared/domain/IOperationMetaData';

export default class TimeSliderOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private settings: any[] = [0, 9999999999999];

  private targetOperation: IDataOperation;

  private readonly id: string;

  constructor(inputOperation: IDataOperation, id:string) {
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
    return Promise.resolve(TimeSliderOperation.name);
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
    const maxAndMinPresent: boolean = settings.length === 2;
    if (!maxAndMinPresent) return Promise.resolve(false);
    if (settings.find((e) => typeof e !== 'number'))
      return Promise.resolve(false);
    this.settings = settings;
    console.log('Recieved settings:', settings);
    return Promise.resolve(true);
  }

  setSource(source: IDataOperation): Promise<void> {
    console.log(
      source.getType(),
      ' is connected to:',
      TimeSliderOperation.name
    );
    this.inputOperation = source;
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const data: IDataPointMovement[] = await this.inputOperation.getData();
      this.outputData = data.filter((e) => {
        const time = e.timestamp.getTime();
        const isLargerThanLowerBound: boolean = time >= this.settings[0];
        const isSmallerThanUpperBound: boolean = time <= this.settings[1];
        return isLargerThanLowerBound && isSmallerThanUpperBound;
      });
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
