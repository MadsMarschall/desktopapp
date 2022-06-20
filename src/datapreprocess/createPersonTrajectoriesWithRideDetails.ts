import sqlite3, { Statement } from 'sqlite3';
import { open } from 'sqlite';
import { DATA_SOURCES } from '../main/datahandling/utilities/vars.config';
import { IDataPointMovement } from '../shared/domain/Interfaces';
import cliProgress from 'cli-progress';
import minimist from 'minimist';
import fs from 'fs';
import { stringify } from 'csv';
import { Stringifier } from 'csv-stringify';
import DataPreProcessor from './DataPreProcessor';

sqlite3.verbose();

export interface IRideDetails {
  parkguide: number,
  realWorldType: string,
  dinofunWorldName: string,
  X: number,
  Y: number,
  type: string,
  rideId: number,
}

const DISTANCE_THRESHHOLD = 5;
let TIME_THRESHHOLD = 5 * 60 * 1000;

if (process.argv.length < 2) {
  console.log('Please provide a database file as an argument');
  process.exit(1);
}
const argv = minimist(process.argv.slice(2));
if (!argv._.length) {
  console.log('Please provide low and high id thresholds as arguments');
}

const config = {
  filename: DATA_SOURCES.SQLITE_DB_PATH,
  driver: sqlite3.cached.Database
};

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const filename = './MovementAndRideData_' + argv._[0] + '-' + argv._[1] + '_calcualtedCheckings_' + (new Date()).valueOf() + '.csv';
const writableStream = fs.createWriteStream(filename);

const columns = [
  'timestamp',
  'PersonId',
  'type',
  'X',
  'Y',
  'rideId',
];

const stringifier = stringify({ header: true, columns: columns });

let lastAddedCheckIn: IDataPointMovement;

open(config).then(async (db) => {
  progressBar.start(parseInt(argv._[1], 10), 0);
  let lastPersonId = 0;
  let allCheckins: IDataPointMovement[] = [];
  let pendingCheckinCandidate: IDataPointMovement[] = [];
  const createTraj = new DataPreProcessor();
  const parkRides = await db.all('select * from ridedetails') as IRideDetails[];
  await new Promise(async (resolve) => {
    await db.all(`select *
            from parkmovementsat
            where PersonId between ${argv._[0]} and ${argv._[1]}
            order by PersonId, timestamp;`).then(async (rows: IDataPointMovement[]) => {
      await createTraj.findAndRunTroughTrajectories(rows, async (data: IDataPointMovement[]) => {
        await progressBar.update(data[0].PersonId);
        await createTraj.determineCheckinsFromTrajectory(data, parkRides, TIME_THRESHHOLD, DISTANCE_THRESHHOLD).then(async (checkins: IDataPointMovement[]) => {
          await createTraj.mapToSpecifiedIntervaæl(checkins, TIME_THRESHHOLD).then(async (mappedCheckins: IDataPointMovement[]) => {
            console.log('mappedCheckins', mappedCheckins.length);
            await mappedCheckins.forEach((checkin: IDataPointMovement) => {
              stringifier.write(checkin);
            });
          });
        });
      });
    });
    resolve(undefined);
  });
  await stringifier.pipe(writableStream);
  progressBar.stop();
  console.log('inserting data\n');
  console.log('Finished writing data');
  console.log(allCheckins.length);

}).catch((err) => {
  console.log(err);
});
