import sqlite3, { Statement } from 'sqlite3';
import { open } from 'sqlite';
import { DATA_SOURCES } from '../main/datahandling/utilities/vars.config';
import { IDataPointMovement } from '../shared/domain/Interfaces';
import cliProgress from 'cli-progress';
import minimist from 'minimist';
import fs from 'fs';
import { stringify } from 'csv';

sqlite3.verbose();

interface IRideDetails {
  parkguide: number,
  realWorldType: string,
  dinofunWorldName: string,
  X: number,
  Y: number,
  type: string,
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

const filename = './MovementData_' + argv._[0] + '-' + argv._[1] + '_calcualtedCheckings_' + (new Date()).valueOf() + '.csv';
const writableStream = fs.createWriteStream(filename);

const columns = [
  'timestamp',
  'PersonId',
  'type',
  'X',
  'Y'
];

const stringifier = stringify({ header: true, columns: columns });

let lastAddedCheckIn: IDataPointMovement;

open(config).then(async (db) => {
  progressBar.start(parseInt(argv._[1], 10), 0);
  let lastPersonId = 0;
  let allCheckins: IDataPointMovement[] = [];
  let pendingCheckinCandidate: IDataPointMovement[] = [];

  const parkRides = await db.all('select * from ridedetails') as IRideDetails[];
  let insertStatement = await db.prepare('insert into parkmovementCalculatedCheckin (timestamp, PersonId, type, X, Y) values (?, ?, ?, ?, ?)');
  await db.all(`select *
                from parkmovement
                where PersonId between ${argv._[0]} and ${argv._[1]}
                order by PersonId, timestamp;`).then(async (rows) => {
    for (const row of rows) {
      row.timestamp = new Date(row.timestamp);

      const isCheckinType = row.type === 'check-in';
      if (isCheckinType) {
        debugger
        lastAddedCheckIn = row;
        stringifier.write(row);
        continue;
      }

      const isNewPerson = row.PersonId != lastPersonId;


      const timeFromLastAddedCheckinIsBiggerThanThreshold = (row.timestamp.getTime() - lastAddedCheckIn.timestamp.getTime()) > TIME_THRESHHOLD;
      if (!timeFromLastAddedCheckinIsBiggerThanThreshold && !isNewPerson) continue;

      if (isNewPerson) {
        pendingCheckinCandidate = [];
        lastPersonId = row.PersonId;
      }
      parkRides.forEach(ride => {
        let distanceToRide = Math.sqrt(Math.pow(row.X - ride.X, 2) + Math.pow(row.Y - ride.Y, 2));
        if (distanceToRide < DISTANCE_THRESHHOLD) {
          row.X = ride.X;
          row.Y = ride.Y;
          pendingCheckinCandidate.push(row);
        }
      });
      await new Promise<void>(async (resolve, reject) => {
        (async () => {
          pendingCheckinCandidate.filter(async (checkinCandidate, index) => {


            const sameTimestampAsPrevious = index > 0 && checkinCandidate.timestamp === pendingCheckinCandidate[index - 1].timestamp;
            if (sameTimestampAsPrevious) return false;

            if (index !== 0) {
              const lastCheckin = pendingCheckinCandidate[index - 1];
              let isSameTime = lastCheckin.timestamp === checkinCandidate.timestamp;
              if (isSameTime) {
                return false;
              }
            }

            let distanceToCheckinCandidate = Math.sqrt(Math.pow(row.X - checkinCandidate.X, 2) + Math.pow(row.Y - checkinCandidate.Y, 2));
            if (distanceToCheckinCandidate > DISTANCE_THRESHHOLD) {
              return false;
            }

            let positionMaintainedOverTimeThreshhold = ((new Date(row.timestamp).getTime() - (new Date(checkinCandidate.timestamp).getTime()) > TIME_THRESHHOLD));
            if (positionMaintainedOverTimeThreshhold) {
              checkinCandidate.type = 'check-in-calculated';
              //allCheckins.push(checkinCandidate);
              lastAddedCheckIn = checkinCandidate;
              stringifier.write(checkinCandidate);
              //await insertStatement.run(checkinCandidate.timestamp, checkinCandidate.PersonId, checkinCandidate.type, checkinCandidate.X, checkinCandidate.Y);
              return false;
            }
            return true;
          });
          lastPersonId = row.PersonId;

        })().then(() => {
          resolve();
        });
      }).catch(err => {
        console.log(err);
      });
      progressBar.update(row.PersonId);
    }
  });
  progressBar.stop();
  console.log('inserting data\n');
  stringifier.pipe(writableStream);
  console.log('Finished writing data');
  console.log(allCheckins.length);
  process.exit(0);

}).catch((err) => {
  console.log(err);
});
