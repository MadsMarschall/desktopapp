import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';

export default class IsNullObject implements IDataOperation {
  getData(): IDataPointMovement[] {
    return [];
  }

  getType(): string {
    return IsNullObject.name;
  }

  retriggerOperationChainBackwards(): Promise<void> {
    return Promise.resolve(undefined);
  }

  retriggerOperationChainForward(): Promise<void> {
    return Promise.resolve(undefined);
  }

  setSource(source: IDataOperation): void {}

  triggerOperation(): Promise<void> {
    return Promise.resolve(undefined);
  }

  getSource(): IDataOperation {
    return new IsNullObject();
  }

  setSettings(settings: any[]): boolean {
    return false;
  }

  getTarget(): IDataOperation {
    return new IsNullObject();
  }

  setTarget(): void {}
}
