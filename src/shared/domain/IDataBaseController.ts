import { TableNames } from '../Constants';
import { IDataPointMovement } from './Interfaces';
import { ICSVInputObject } from '../../main/datahandling/utilities/DataBaseController';

export default interface IDataBaseController {
  getDataByPersonId(
    SQLTableName: TableNames,
    PersonId: number
  ): Promise<IDataPointMovement[]>;

  loadDataIntoDatabase(
    pathToCSV: string,
    SQLTableName: TableNames
  ): Promise<void>;

  insertInDatabase(
    object: ICSVInputObject,
    SQLTableName: TableNames
  ): Promise<boolean>;

  getAllDataFromTable(SQLTableName: TableNames,sortBy:string): Promise<IDataPointMovement[]>;
}
