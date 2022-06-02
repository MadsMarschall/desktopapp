import * as mysql from 'mysql2';
import { Pool } from 'mysql2';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import { DATA_SOURCES } from './vars.config';

// the following lines are necessary for JEST to be able to unit test
import { MovementDataQuieries } from './MovementDataQuieries';
import { TableNames } from '../../../shared/Constants';
import { IDataPointMovement } from '../../../shared/domain/Interfaces';
import IDataBaseController from '../../../shared/domain/IDataBaseController';

export interface ICSVInputObject {
  Timestamp: string;
  id: number;
  type: string;
  X: string;
  Y: string;
}



export default class DataBaseController implements IDataBaseController {
  private readonly connectionPool: Pool;

  constructor() {
    this.connectionPool = mysql.createPool({
      connectionLimit: 100,
      host: DATA_SOURCES.mySqlDataSource.DB_HOST,
      user: DATA_SOURCES.mySqlDataSource.DB_USER,
      database: DATA_SOURCES.mySqlDataSource.DB_DATABASE,
      password: DATA_SOURCES.mySqlDataSource.DB_PASSWORD,
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
    SQLTableName: TableNames,
    PersonId: number
  ): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      let q: string | null = null;
      if (SQLTableName === TableNames.FRIDAY)
        q = MovementDataQuieries.GET_BY_PERSON_ID.friday;
      if (SQLTableName === TableNames.SATURDAY)
        q = MovementDataQuieries.GET_BY_PERSON_ID.saturday;
      if (SQLTableName === TableNames.SUNDAY)
        q = MovementDataQuieries.GET_BY_PERSON_ID.sunday;
      if (SQLTableName === TableNames.TEST)
        q = MovementDataQuieries.GET_ALL.test;
      if (!q) throw new Error('no query was selected');
      const result = await this.execute<{ affectedRows: number }>(q, [
        PersonId,
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
        transformHeader: undefined,
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
      q = MovementDataQuieries.INSERT.friday;
    if (SQLTableName === TableNames.SATURDAY)
      q = MovementDataQuieries.INSERT.saturday;
    if (SQLTableName === TableNames.SUNDAY)
      q = MovementDataQuieries.INSERT.sunday;
    if (SQLTableName === TableNames.TEST) q = MovementDataQuieries.INSERT.test;

    const result = await this.execute<{ affectedRows: number }>(q, [
      object.Timestamp,
      object.id,
      object.type,
      object.X,
      object.Y,
    ]);
    return result.affectedRows > 0;
  }

  async getAllDataFromTable(
    SQLTableName: TableNames,
    sortBy?: string,
  ): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      let q = '';
      if (SQLTableName === TableNames.FRIDAY)
        q = MovementDataQuieries.GET_ALL.friday;
      if (SQLTableName === TableNames.SATURDAY)
        q = MovementDataQuieries.GET_ALL.saturday;
      if (SQLTableName === TableNames.SUNDAY)
        q = MovementDataQuieries.GET_ALL.sunday;
      if (SQLTableName === TableNames.TEST)
        q = MovementDataQuieries.GET_ALL.test;
      if(sortBy){
        q += ` ORDER BY ${sortBy}`;
      }

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
}

export const dbController = new DataBaseController();
