import * as mysql from 'mysql2';
import { Pool } from 'mysql2';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import { DATA_SOURCES } from '../vars.config';

// the following lines are necessary for JEST to be able to unit test
import { SQLMovementDataQuieries } from '../SQLMovementDataQuieries';
import { SortBy, TableIndexing, TableNames } from '../../../../shared/Constants';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import IDataBaseController from '../../../../shared/domain/IDataBaseController';

export interface ICSVInputObject {
  Timestamp: string;
  id: number;
  type: string;
  X: string;
  Y: string;
}


export default class MySQLDatabaseControllerStrategy implements IDataBaseController {
  private readonly connectionPool: Pool;

  constructor() {
    this.connectionPool = mysql.createPool({
      connectionLimit: 100,
      host: DATA_SOURCES.mySqlDataSource.DB_HOST,
      user: DATA_SOURCES.mySqlDataSource.DB_USER,
      database: DATA_SOURCES.mySqlDataSource.DB_DATABASE,
      password: DATA_SOURCES.mySqlDataSource.DB_PASSWORD
    });
  }


  private execute = <T>(
    query: string,
    params: string[] | Object
  ): Promise<T> => {
    try {
      if (!this.connectionPool)
        throw new Error(
          'Pool was not created. Ensure pool is created when running the app.'
        );
      return new Promise<T>((resolve, reject) => {
        this.connectionPool.query(query, params, (error, results) => {
          if (error) reject(error);
          else {
            // @ts-ignore
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error('[mysql.connector][execute][Error]: ', error);
      throw new Error('failed to execute MySQL query');
    }
  };

  getDataByPersonId(
    PersonId: number
  ): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      const q = "SELECT * FROM parkmovementCalculatedCheckin WHERE PersonId = ? order by timestamp";
      const result = await this.execute<{ affectedRows: number }>(q, [
        PersonId
      ]);
      if (result == null) {
        reject('Could not get data from database');
        return;
      }
      resolve(result as unknown as IDataPointMovement[]);
    });
  }

  async loadDataIntoDatabase(
    pathToCSV: string,
    SQLTableName: TableNames
  ): Promise<void> {
    return new Promise((resolve) => {
      const readStream = fs.createReadStream(path.resolve(pathToCSV), 'utf8');
      const config = {
        delimiter: '', // auto-detect
        header: true,
        transformHeader: undefined
      };
      const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, config);
      readStream.pipe(parseStream);

      parseStream.on('data', (chunk: ICSVInputObject) => {
        this.insertInDatabase(chunk, SQLTableName);
      });
      parseStream.on('finish', () => {
        resolve();
      });
    });
  }

  async insertInDatabase(
    object: ICSVInputObject,
    SQLTableName: TableNames
  ): Promise<boolean> {
    let q = '';
    if (SQLTableName === TableNames.FRIDAY)
      q = SQLMovementDataQuieries.INSERT.friday;
    if (SQLTableName === TableNames.SATURDAY)
      q = SQLMovementDataQuieries.INSERT.saturday;
    if (SQLTableName === TableNames.SUNDAY)
      q = SQLMovementDataQuieries.INSERT.sunday;
    if (SQLTableName === TableNames.TEST) q = SQLMovementDataQuieries.INSERT.test;

    const result = await this.execute<{ affectedRows: number }>(q, [
      object.Timestamp,
      object.id,
      object.type,
      object.X,
      object.Y
    ]);
    return result.affectedRows > 0;
  }

  async getAllDataFromTable(): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      const q = `SELECT * FROM parkmovementCalculatedCheckin order by PersonId, timestamp`;
      const result = (await this.execute<{ affectedRows: number }>(
        q,
        []
      )) as IDataPointMovement;
      if (result == null) {
        reject('Could not get data from database');
        return;
      }
      resolve(result as unknown as IDataPointMovement[]);
    });
  }

  async getDataByTimeInterval(lowerBound: Date, upperBound: Date): Promise<IDataPointMovement[]> {
    let q = `SELECT * FROM parkmovementfri where (timestamp between ? and ? )`;
    const result = this.execute<IDataPointMovement[]>(q, [
      lowerBound,
      upperBound
    ]);
    return result;
  }

  private getIndexingByRequest(
    SQLTableName: TableNames,
    sortBy: SortBy
  ): string {
    if (SQLTableName === TableNames.FRIDAY && sortBy === SortBy.Timestamp)
      return TableIndexing.FRIDAY_Timestamp;
    if (SQLTableName === TableNames.FRIDAY && sortBy === SortBy.PersonId)
      return TableIndexing.FRIDAY_PersonId;
    if (SQLTableName === TableNames.SATURDAY && sortBy === SortBy.Timestamp)
      return TableIndexing.SATURDAY_Timestamp;
    if (SQLTableName === TableNames.SATURDAY && sortBy === SortBy.PersonId)
      return TableIndexing.SATURDAY_PersonId;
    if (SQLTableName === TableNames.SUNDAY && sortBy === SortBy.Timestamp)
      return TableIndexing.SUNDAY_Timestamp;
    if (SQLTableName === TableNames.SUNDAY && sortBy === SortBy.PersonId)
      return TableIndexing.SUNDAY_PersonId;
    else {
      return '';
    }

  }
}

