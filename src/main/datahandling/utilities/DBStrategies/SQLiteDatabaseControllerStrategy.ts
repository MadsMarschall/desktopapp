import * as mysql from 'mysql2';
import { Pool } from 'mysql2';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import { DATA_SOURCES } from '../vars.config';

// the following lines are necessary for JEST to be able to unit test
import { SortBy, TableIndexing, TableNames } from '../../../../shared/Constants';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import IDataBaseController from '../../../../shared/domain/IDataBaseController';
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { SQLiteMovementDataQuieries } from '../SQLMovementDataQuieries';


sqlite3.verbose();

export interface ICSVInputObject {
  Timestamp: string;
  id: number;
  type: string;
  X: string;
  Y: string;
}


export default class SQLiteDatabaseControllerStrategy implements IDataBaseController {
  private db: Database | undefined;

  constructor() {
    this.init();
  }

  public async init() {
    await open({
      filename: DATA_SOURCES.SQLITE_DB_PATH,
      driver: sqlite3.cached.Database
    }).then((db) => {
      this.db = db;
    }).catch((err) => {
      throw new Error(err);
    });
  }


  private execute = <T>(
    query: string,
    params: any[]
  ): Promise<T> => {
    try {

      return new Promise<T>(async (resolve, reject) => {
        if (!this.db) {
          await this.init();
        }
        if (!this.db) return reject('Could not connect to database. Please check if the database is running');
        this.db.all(query, ...params).then((rows) => {
          resolve(rows as unknown as T);
        })
      });

    } catch (error) {
      return Promise.reject(error);
    }
  };

  getDataByPersonId(
    PersonId: number
  ): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      let q = 'SELECT * FROM parkmovementFinal WHERE personId = ? ORDER BY timestamp';
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
    throw new Error('Method not implemented.');
  }

  async insertInDatabase(
    object: ICSVInputObject,
    SQLTableName: TableNames
  ): Promise<boolean> {
    throw new Error('Method not implemented.');

  }

  async getAllDataFromTable(): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      let q = 'SELECT * FROM parkmovementFinal ORDER BY PersonId,timestamp';
      const result = (await this.execute<{ affectedRows: number }>(q,
        []
      )) as IDataPointMovement;
      if (result == null) {
        reject('Could not get data from database');
        return;
      }
      resolve(result as unknown as IDataPointMovement[]);
    });
  }
  public async getAllDataFromTableSortedByTime(): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      let q = 'SELECT * FROM parkmovementFinal ORDER BY timestamp';
      const result = (await this.execute<{ affectedRows: number }>(q,
        []
      )) as IDataPointMovement;
      if (result == null) {
        reject('Could not get data from database');
        return;
      }
      resolve(result as unknown as IDataPointMovement[]);
    });
  }

  async getAllCheckins(): Promise<IDataPointMovement[]> {
    return new Promise(async (resolve, reject) => {
      let q = "SELECT * FROM parkmovementFinal where type='check-in' ORDER BY timestamp";
      const result = (await this.execute<{ affectedRows: number }>(q,
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
    let q = `SELECT *
             FROM parkmovementFinal
             where (timestamp between ? and ?)`;
    const result = this.execute<IDataPointMovement[]>(q, [
      lowerBound.valueOf(),
      upperBound.valueOf()
    ]);
    return result;
  }
}

