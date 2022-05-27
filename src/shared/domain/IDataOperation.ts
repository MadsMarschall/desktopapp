import { IDataPointMovement } from './Interfaces';

export default interface IDataOperation {
  getData(): IDataPointMovement[];
  getType(): string;
  setSettings(settings: any[]): boolean;
  triggerOperation(): Promise<void>;
  retriggerOperationChainBackwards(): Promise<void>;
  retriggerOperationChainForward(): Promise<void>;
  setSource(source: IDataOperation): void;
  getSource(): IDataOperation;
  setTarget(target: IDataOperation): void;
  getTarget(): IDataOperation;
}
