import IDataOperation from './IDataOperation';

export interface IOperationMeta {
  id: string,
  name: string,
  settings: unknown[],
  entries: number,
  sourceOperationId: string,
  targetOperationId: string,
}


