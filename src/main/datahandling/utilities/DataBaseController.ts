import IDataBaseController from '../../../shared/domain/IDataBaseController';
import { SortBy, TableIndexing, TableNames } from '../../../shared/Constants';
import { ICSVInputObject, IDataPointMovement } from '../../../shared/domain/Interfaces';
import MySQLDatabaseControllerStrategy from './DBStrategies/MySQLDatabaseControllerStrategy';
import SQLiteDatabaseControllerStrategy from './DBStrategies/SQLiteDatabaseControllerStrategy';

export default class DataBaseController implements IDataBaseController {
  private DBStrategy
  constructor(dbstrategy:IDataBaseController) {
    this.DBStrategy = dbstrategy;
  }
  getAllDataFromTable(SQLTableName: TableNames, sortBy: SortBy, indexing: TableIndexing): Promise<IDataPointMovement[]> {
    return this.DBStrategy.getAllDataFromTable(SQLTableName, sortBy, indexing);
  }

  getDataByPersonId(SQLTableName: TableNames, PersonId: number): Promise<IDataPointMovement[]> {
    return this.DBStrategy.getDataByPersonId(SQLTableName, PersonId);
  }

  getDataByTimeInterval(lowerBound: Date, upperBound: Date, SQLTableName: TableNames): Promise<IDataPointMovement[]> {
    return this.DBStrategy.getDataByTimeInterval(lowerBound, upperBound, SQLTableName);
  }

  insertInDatabase(object: ICSVInputObject, SQLTableName: TableNames, ...otherArgs: string[]): Promise<boolean> {
    return this.DBStrategy.insertInDatabase(object, SQLTableName, ...otherArgs);
  }

  loadDataIntoDatabase(pathToCSV: string, SQLTableName: TableNames): Promise<void> {
    return this.DBStrategy.loadDataIntoDatabase(pathToCSV, SQLTableName);
  }

}
export const dbController = new DataBaseController(new SQLiteDatabaseControllerStrategy());
