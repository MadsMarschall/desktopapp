import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import IObserver from '../../../../shared/domain/IObserver';
import ISubject from '../../../../shared/domain/ISubject';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';

export default class TimePlayerOperation implements IDataOperation, ISubject {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[] = [];

  private settings: any[] = [0];

  private targetOperation: IDataOperation;

  private observers: IObserver[] = [];

  private readonly id: string;

  constructor(inputOperation: IDataOperation, id: string) {
    this.id = id;
    this.targetOperation = new IsNullObject();
    this.inputOperation = inputOperation;
  }

  getId(): Promise<string> {
        return Promise.resolve(this.id);
    }

  getData(): Promise<IDataPointMovement[]> {
    return Promise.resolve(this.outputData);
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  getType(): Promise<string> {
    return Promise.resolve(TimePlayerOperation.name);
  }

  retriggerOperationChainBackward(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackward();
      await this.inputOperation.triggerOperation();
      resolve();
    });
  }

  retriggerOperationChainForward(): Promise<void> {
    return new Promise(async () => {
      await this.triggerOperation();
      await this.targetOperation.retriggerOperationChainForward();
    });
  }

  setSettings(settings: any[]): Promise<boolean> {
    const settingsPresent: boolean = settings.length === 0;
    if (!settingsPresent) return Promise.resolve(false);
    return Promise.resolve(true);
  }

  async setSource(source: IDataOperation): Promise<void> {
    this.inputOperation = source;
    const data: IDataPointMovement[] = await source.getData();
    if (data.length < 1) return Promise.resolve();
    this.settings = [this.inputOperation.getData()[0].timestamp.getTime()];
    return Promise.resolve();
  }

  triggerOperation(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const data = await this.inputOperation.getData();
      const temp = data.filter((e) => {
        const time = e.timestamp.getTime();
        return time === this.settings[0];
      });
      if (temp.length === 0) resolve();
      this.outputData = temp;
      this.notifyObservers();
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

  addObserver(obs: IObserver): void {
    this.observers.push(obs);
  }

  notifyObservers(): void {
    this.observers.forEach((obs) => obs.update());
  }

  getSettings(): Promise<any[]> {
    return Promise.resolve(this.settings);
  }
}
