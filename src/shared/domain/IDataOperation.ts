import { IDataPointMovement } from './Interfaces';

export default interface IDataOperation {
  getData(): Promise<IDataPointMovement[]>;

  getType(): Promise<string>;

  setSettings(settings: any[]): Promise<boolean>;
  triggerOperation(): Promise<void>;
  retriggerOperationChainBackward(): Promise<void>;
  retriggerOperationChainForward(): Promise<void>;

  setSource(source: IDataOperation): Promise<void>;

  getSource(): Promise<IDataOperation>;

  setTarget(target: IDataOperation): Promise<void>;

  getTarget(): Promise<IDataOperation>;
}
