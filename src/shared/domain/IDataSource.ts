import IDataOperation from './IDataOperation';

export default interface IDataSource extends IDataOperation {
  loadData(): void;
}
