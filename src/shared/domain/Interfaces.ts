import { TableNames } from '../Constants';

export interface ICSVInputObject {
  Timestamp: string;
  id: number;
  type: string;
  X: string;
  Y: string;
}

export interface IDataPointMovement {
  timestamp: Date;
  PersonId: number;
  type: string;
  X: number;
  Y: number;
  id: string;
  affectedRows: number;
}

export interface PersonDataEvent {
  timestamp: Date;
  X: number;
  Y: number;
}

export interface PersonData {
  id: number;
  events: PersonDataEvent[];
}

export interface IDataBaseController {
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

  getAllDataFromTable(SQLTableName: TableNames): Promise<IDataPointMovement[]>;
}
