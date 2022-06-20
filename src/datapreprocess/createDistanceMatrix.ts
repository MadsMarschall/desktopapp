import { DATA_SOURCES } from '../main/datahandling/utilities/vars.config';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import CreateLevenstheinMatrix from './CreateLevenstheinMatrix';
import cliProgress from 'cli-progress';

const config = {
  filename: DATA_SOURCES.SQLITE_DB_PATH,
  driver: sqlite3.cached.Database
};
const v8 = require('v8');
const totalHeapSize = v8.getHeapStatistics().total_available_size;
const totalHeapSizeGb = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);
console.log('totalHeapSizeGb: ', totalHeapSizeGb);

open(config).then(async (db) => {
  db.all("SELECT * FROM parkmovementFinal order by PersonId, timestamp").then((rows) => {
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const createDistanceMatrix = new CreateLevenstheinMatrix(rows,progressBar);
  createDistanceMatrix.createMatrix();
  })
})
