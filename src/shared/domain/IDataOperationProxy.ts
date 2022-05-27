import IDataOperation from './IDataOperation';

export default interface IDataOperationProxy extends IDataOperation {
  getId(): string;
}
