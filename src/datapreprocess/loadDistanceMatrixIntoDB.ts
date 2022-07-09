import dm from "../../distanceMatrix.json";
import personIds from './personIds';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/ElectronDatabase.db');
import cliProgress from 'cli-progress';
import fs from 'fs';
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);




const loadDistanceMatrixIntoDB = async (distanceMatrix:Array<number[]>) => {
    progressBar.start(personIds.length, 0);
    for(let i = 0; i < distanceMatrix.length; i++) {
      await progressBar.update(i);
      for (let j = i; j < personIds.length; j++) {
        await fs.appendFileSync("./matrixReformatted.txt", ""+(personIds[i]+","+personIds[j]+","+distanceMatrix[i][j]+"\n"));
      }
    }
    progressBar.stop();
  }


loadDistanceMatrixIntoDB(<Array<number[]>>dm);

