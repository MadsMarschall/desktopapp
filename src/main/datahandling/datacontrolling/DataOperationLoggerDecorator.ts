import IDataOperation from '../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../shared/domain/Interfaces';

export default class DataOperationLoggerDecorator implements IDataOperation {
    private dataOperation: IDataOperation;

    constructor(dataOperation: IDataOperation) {
        this.dataOperation = dataOperation;
    }

  getSettings(): Promise<any[]> {
      console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.getSettings.name}] getting settings`)
    return this.dataOperation.getSettings();
    }

  getData(): Promise<IDataPointMovement[]> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.getData.name}] getting data`);
    return this.dataOperation.getData();
  }

  getSource(): Promise<IDataOperation> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.getSource.name}] getting source`);
    return this.dataOperation.getSource();
  }

  getTarget(): Promise<IDataOperation> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.getTarget.name}] getting target`);
    return this.dataOperation.getTarget();
  }

  getType(): Promise<string> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.getType.name}] getting type`);
    return this.dataOperation.getType();
  }

  retriggerOperationChainBackward(): Promise<void> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.retriggerOperationChainBackward.name}] retriggering operation chain backward`);
    return this.dataOperation.retriggerOperationChainBackward();
  }

  retriggerOperationChainForward(): Promise<void> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.retriggerOperationChainForward.name}] retriggering operation chain forward`);
    return this.dataOperation.retriggerOperationChainForward();
  }

  setSettings(settings: any[]): Promise<boolean> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.setSettings.name}] setting settings`);
    return this.dataOperation.setSettings(settings);
  }

  setSource(source: IDataOperation): Promise<void> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.setSource.name}] setting source`);
    return this.dataOperation.setSource(source);
  }

  setTarget(target: IDataOperation): Promise<void> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.setTarget.name}] setting target`);
    return this.dataOperation.setTarget(target);
  }

  triggerOperation(): Promise<void> {
    console.log((new Date()).toLocaleTimeString(),`[${this.dataOperation.constructor.name}:${this.triggerOperation.name}] triggering operation`);
    return this.dataOperation.triggerOperation();
  }

  getId(): Promise<string> {
    return this.dataOperation.getId();
  }

}
