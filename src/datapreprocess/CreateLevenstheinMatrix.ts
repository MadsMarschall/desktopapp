import { IDataPointMovement } from '../shared/domain/Interfaces';
import levenshtein from 'js-levenshtein';
import fs from 'fs';
import { ProgressBar } from 'react-bootstrap';
import cliProgress, { SingleBar } from 'cli-progress';
import { LevenshteinWorker } from './levenshteinWorker';
import { spawn, Thread, Worker } from 'threads';
import * as Path from 'path';

type ITrajectoryObject = {
  trajectory: string,
  PersonId: number
}
export default class CreateLevenstheinMatrix {
  private data: IDataPointMovement[];
  private preparedData: Array<ITrajectoryObject>;
  private distanceMatrix: Array<Array<number>>;
  private prgressBar: SingleBar | undefined;

  public constructor(data: IDataPointMovement[], progressBar?: SingleBar) {
    this.data = data;
    this.preparedData = [];
    this.distanceMatrix = [];
    this.prgressBar = progressBar;
  }

  public async createMatrix() {
    console.log('CREATE MATRIX');
    this.prepareData();
    await this.calculateAsyncLevesthein();
    //this.calculateLevesthein();
    await this.saveDistanceMatrixToJSON('./'+(new Date).getTime()+'distanceMatrix.json');
  }

  public async saveDistanceMatrixToJSON(path: string) {
    console.log('SAVE MATRIX TO JSON');
    const stringify = (data:any):Promise<string> =>{
      return new Promise((resolve)=>{
        resolve(JSON.stringify(data));
      })
    }
    const json = await stringify(this.distanceMatrix);

    await fs.writeFile(path, json, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
      }
    });
  }

  public async calculateAsyncLevesthein() {
    console.log('CALCULATE LEVESTHEIN');
    this.startLoadingProgress(this.preparedData.length, 0);
    const matrix = new Array<Promise<Array<number>>>();
    for (let i = 0; i < this.preparedData.length; i++) {
      if(i%100==0){
        await Promise.all(matrix);
      }
      this.updateLoadingProgress(i);
      matrix[i] = this.calculateLevenstheinArrayByWorker(this.preparedData[i].trajectory, this.preparedData.map((row) => row.trajectory));
    }
    this.stopLoadingProgress();
    Promise.all(matrix).then((result) => {
      this.distanceMatrix = result;
    })
  }

  public calculateLevesthein() {
    console.log('CALCULATE LEVESTHEIN');
    this.startLoadingProgress(this.preparedData.length, 0);
    const matrix = new Array<Array<number>>();
    for (let i = 0; i < this.preparedData.length; i++) {
      this.updateLoadingProgress(i);
      matrix[i] = new Array<number>();
      for (let j = 0; j < this.preparedData.length; j++) {
        matrix[i][j] = this.calculateLevenstheinDistance(this.preparedData[i].trajectory, this.preparedData[j].trajectory);
      }
    }
    this.stopLoadingProgress();
    this.distanceMatrix = matrix;
  }

  async calculateLevenstheinArrayByWorker(target: string, trajectories: string[]): Promise<number[]> {
    const levenstheinWorker = await spawn<LevenshteinWorker>(new Worker('./levenshteinWorker.ts'));

    const result = await levenstheinWorker.calculateArray(target, trajectories);
    await Thread.terminate(levenstheinWorker);
    return result;

    //return levenshtein(trajectory1, trajectory2);
  }

  private calculateLevenstheinDistance(trajectory1: string, trajectory2: string): number {
    return levenshtein(trajectory1, trajectory2);
  }

  public prepareData() {
    console.log('PREPARE DATA');
    this.startLoadingProgress(this.data[this.data.length - 1].PersonId, 0);
    const result = new Array<ITrajectoryObject>();
    this.findAndRunTroughTrajectories(this.data, (trajectory: IDataPointMovement[]) => {
      this.updateLoadingProgress(trajectory[0].PersonId);
      const trajectoryIsWrongLength = trajectory.length != 192;
      if (trajectoryIsWrongLength) return;
      const string = trajectory.map((row) => row.rideId).join(';');
      const trajectoryObject: ITrajectoryObject = {
        trajectory: string,
        PersonId: trajectory[0].PersonId
      };
      result.push(trajectoryObject);
    });
    this.stopLoadingProgress();
    this.preparedData = result;
  }

  private findAndRunTroughTrajectories(data: IDataPointMovement[], callback: (data: IDataPointMovement[]) => void) {
    let trajectory: IDataPointMovement[] = [];
    let lastPersonId = data[0].PersonId;
    for (const row of data) {

      const isNewPerson = row.PersonId != lastPersonId;
      if (isNewPerson) {
        callback(trajectory);
        trajectory = new Array();
      }
      trajectory.push(row);
      lastPersonId = row.PersonId;
    }
    callback(trajectory);
  }

  private stopLoadingProgress() {
    if (this.prgressBar) {
      this.prgressBar.stop();
    }
  }

  private updateLoadingProgress(number: number) {
    if (this.prgressBar) {
      this.prgressBar.update(number);
    }
  }

  private startLoadingProgress(total: number, start: number) {
    if (this.prgressBar) {
      this.prgressBar.start(total, start);
    }
  }
}
