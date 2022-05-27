import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import IObserver from '../../../../shared/domain/IObserver';
import ISubject from '../../../../shared/domain/ISubject';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';

export default class TimePlayerOperation implements IDataOperation, ISubject {
  private inputOperation: IDataOperation;

  private outputData: IDataPointMovement[];

  private settings: any[] = [0];

  private targetOperation: IDataOperation;

  private observers: IObserver[] = [];

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
    return TimePlayerOperation.name;
  }

  retriggerOperationChainBackwards(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackwards();
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

  setSettings(settings: any[]): boolean {
    const settingsPresent: boolean = settings.length === 0;
    if (!settingsPresent) return false;
    return true;
  }

  setSource(source: IDataOperation): void {
    this.inputOperation = source;
    if (this.inputOperation.getData().length < 1) return;
    this.settings = [this.inputOperation.getData()[0].timestamp.getTime()];
  }

  triggerOperation(): Promise<void> {
    debugger;
    return new Promise<void>(async (resolve) => {
      const temp = this.inputOperation.getData().filter((e) => {
        const time = e.timestamp.getTime();
        return time === this.settings[0];
      });
      if (temp.length === 0) resolve();
      this.outputData = temp;
      this.notifyObservers();
      resolve();
    });
  }

  getTarget(): IDataOperation {
    return this.targetOperation;
  }

  setTarget(target: IDataOperation): void {
    this.targetOperation = target;
  }

  addObserver(obs: IObserver): void {
    this.observers.push(obs);
  }

  notifyObservers(): void {
    this.observers.forEach((obs) => obs.update());
  }
}
