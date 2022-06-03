import { SortBy, TableIndexing, TableNames } from '../Constants';
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
    SQLTableName: TableNames,
    ...otherArgs:string[]
  ): Promise<boolean>;

  getAllDataFromTable(SQLTableName: TableNames,sortBy:SortBy,indexing:TableIndexing): Promise<IDataPointMovement[]>;
}
