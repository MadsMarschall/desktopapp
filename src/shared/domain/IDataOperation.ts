import { IDataPointMovement } from './Interfaces';

export default interface IDataOperation {
  getId(): Promise<string>;

  getData(): Promise<IDataPointMovement[]>;

  getType(): Promise<string>;

  setSettings(settings: any[]): Promise<boolean>;
  getSettings(): Promise<any[]>;
  triggerOperation(): Promise<void>;
  retriggerOperationChainBackward(): Promise<void>;
  retriggerOperationChainForward(): Promise<void>;

  setSource(source: IDataOperation): Promise<void>;

  getSource(): Promise<IDataOperation>;

  setTarget(target: IDataOperation): Promise<void>;

  getTarget(): Promise<IDataOperation>;

  getMetaData(): Promise<IOperationMeta>;
}
