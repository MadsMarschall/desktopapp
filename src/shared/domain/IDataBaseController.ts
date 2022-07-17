import { SortBy, TableIndexing, TableNames } from '../Constants';
import { IDataPointMovement, IDistanceMatrixPoint } from './Interfaces';
import { ICSVInputObject } from '../../main/datahandling/utilities/DBStrategies/MySQLDatabaseControllerStrategy';



export default interface IDataBaseController {
  execute<T>(query: string, params: any[]): Promise<T>;
  getDataByPersonId(
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


  getAllDataFromTable(): Promise<IDataPointMovement[]>;
  getDataByTimeInterval(lowerBound:Date, upperBound:Date): Promise<IDataPointMovement[]>;
  getMatrixByThreshold(threshold: number): Promise<IDistanceMatrixPoint[]>
}
