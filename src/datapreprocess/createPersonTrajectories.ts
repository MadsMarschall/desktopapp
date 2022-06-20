import sqlite3, { Statement } from 'sqlite3';
import { open } from 'sqlite';
import { DATA_SOURCES } from '../main/datahandling/utilities/vars.config';
import { IDataPointMovement } from '../shared/domain/Interfaces';
import cliProgress from 'cli-progress';
import minimist from 'minimist';
import fs from 'fs';
import { stringify } from 'csv';
import { Stringifier } from 'csv-stringify';

sqlite3.verbose();

export interface IRideDetails {
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
  const createTraj = new CreatePersonTrajectories();
  const parkRides = await db.all('select * from ridedetails') as IRideDetails[];
  let insertStatement = await db.prepare('insert into parkmovementCalculatedCheckin (timestamp, PersonId, type, X, Y) values (?, ?, ?, ?, ?)');
  await new Promise(async (resolve) => {
    await db.all(`select *
            from parkmovement
            where PersonId between ${argv._[0]} and ${argv._[1]}
            order by PersonId, timestamp;`).then(async (rows: IDataPointMovement[]) => {
      await progressBar.update(rows[0].PersonId);
      await createTraj.findAndRunTroughTrajectories(rows, async (data: IDataPointMovement[]) => {
        await progressBar.update(data[0].PersonId);
        await createTraj.determineCheckinsFromTrajectory(data, parkRides, TIME_THRESHHOLD, DISTANCE_THRESHHOLD).then(async (checkins: IDataPointMovement[]) => {
          await checkins.forEach((checkin: IDataPointMovement) => {
            stringifier.write(checkin);
          });
          /*
          await createTraj.mapToSpecifiedIntervaæl(checkins, TIME_THRESHHOLD).then(async (mappedCheckins: IDataPointMovement[]) => {
            console.log('mappedCheckins', mappedCheckins.length);
            await mappedCheckins.forEach((checkin: IDataPointMovement) => {
              stringifier.write(checkin);
            });
          });

           */
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

export default class CreatePersonTrajectories {

  findAndRunTroughTrajectories(data: IDataPointMovement[], callback: (data: IDataPointMovement[]) => void) {
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

  determineCheckinsFromTrajectory(unformattedTrajecotry: IDataPointMovement[], rides: IRideDetails[], TIME_THRESHHOLD: number, DISTANCE_THRESHHOLD: number): Promise<IDataPointMovement[]> {
    return new Promise((resolve, reject) => {
      let formattedTrajectory: IDataPointMovement[] = [];
      let pendingCheckinCandidate: IDataPointMovement[] = [];
      for (const row of unformattedTrajecotry) {
        row.timestamp = new Date(row.timestamp);
        const firstEntryIsCheckin = formattedTrajectory.length == 0;
        if (firstEntryIsCheckin) {
          row.timestamp = this.roundTime(row);
          formattedTrajectory.push(row);
        }

        rides.forEach((ride) => {
          let distanceToRide = Math.sqrt(Math.pow(row.X - ride.X, 2) + Math.pow(row.Y - ride.Y, 2));
          if (distanceToRide <= DISTANCE_THRESHHOLD) {
            row.X = ride.X;
            row.Y = ride.Y;
            pendingCheckinCandidate.push(row);
          }
        });
        pendingCheckinCandidate = pendingCheckinCandidate.filter((checkinCandidate, index) => {
          const isToFarAwayFromRide = Math.sqrt(Math.pow(checkinCandidate.X - row.X, 2) + Math.pow(checkinCandidate.Y - row.Y, 2)) > DISTANCE_THRESHHOLD;
          if (isToFarAwayFromRide) {
            return false;
          }
          const timeIsOverThreshold = (new Date(row.timestamp).getTime() - (new Date(checkinCandidate.timestamp).getTime()) > TIME_THRESHHOLD);
          if (timeIsOverThreshold) {
            checkinCandidate.type = 'check-in';

            //Rounding to nearest 5 minutes
            checkinCandidate.timestamp = this.roundTime(checkinCandidate);

            const timestampIsAlreadyInList = (new Date(formattedTrajectory[formattedTrajectory.length - 1].timestamp)).getTime() == checkinCandidate.timestamp.getTime();
            if (timestampIsAlreadyInList) return false;

            formattedTrajectory.push(checkinCandidate);
            return false;
          }
          return true;
        });
      }
      resolve(formattedTrajectory);
    });
  }

  private roundTime(checkinCandidate: IDataPointMovement): Date {
    const coeff = 1000 * 60 * 5;
    const date = new Date(checkinCandidate.timestamp);  //or use any other date
    return new Date(Math.round(date.getTime() / coeff) * coeff);
  }

  simplifyToTimeInterval(data: IDataPointMovement[], TIME_INTERVAL: number): IDataPointMovement[] {
    let result: IDataPointMovement[] = [];
    result.push(data[0]);
    for (let i = 1; i < data.length; i++) {
      const overThreshold = ((new Date(data[i].timestamp).getTime() - (new Date(result[result.length - 1].timestamp).getTime())) >= TIME_INTERVAL);
      if (overThreshold) {
        result.push(data[i]);
      }
    }
    return result;
  }

  mapToSpecifiedIntervaæl(trajectory: IDataPointMovement[], TIME_INTERVAL: number): Promise<IDataPointMovement[]> {
    return new Promise((resolve, reject) => {
      if (trajectory.length === 0) reject('No data');
      const createOutOfParkPoint = (timestamp: number): IDataPointMovement => {
        const point: IDataPointMovement = {
          timestamp: new Date(timestamp.valueOf()),
          X: -99,
          Y: -99,
          type: 'out-of-park',
          PersonId: trajectory[0].PersonId,
          affectedRows: 0,
          id: 'calculatedEntry_' + trajectory[0].PersonId + '_' + timestamp
        };
        return point;
      };
      let currentTimeOfDay = (new Date(trajectory[0].timestamp));
      currentTimeOfDay = (new Date(currentTimeOfDay.setHours(8, 0, 0, 0)));

      let endOfDay = (new Date(trajectory[0].timestamp));
      endOfDay = (new Date(endOfDay.setHours(24, 0, 0, 0)));
      let result: IDataPointMovement[] = [];

      let indexInTrajectory = 0;
      let lastAddedCheckIn = createOutOfParkPoint(currentTimeOfDay.valueOf());

      while (currentTimeOfDay.getTime() < endOfDay.getTime()) {
        const reachedEndOfTrajectory = indexInTrajectory >= trajectory.length;
        if (reachedEndOfTrajectory) {
          result.push(createOutOfParkPoint(currentTimeOfDay.valueOf()));
          currentTimeOfDay.setTime(currentTimeOfDay.getTime() + TIME_INTERVAL);
          continue;
        }
        const reachedIndexInTrajectory = (new Date(trajectory[indexInTrajectory].timestamp)).getTime() <= currentTimeOfDay.getTime();
        if (reachedIndexInTrajectory) {
          trajectory[indexInTrajectory].timestamp = this.roundTime(trajectory[indexInTrajectory]);
          lastAddedCheckIn = trajectory[indexInTrajectory];
          result.push(trajectory[indexInTrajectory]);
          indexInTrajectory++;
        } else {

          lastAddedCheckIn = this.createObjectCopy(lastAddedCheckIn);
          lastAddedCheckIn.timestamp = new Date(lastAddedCheckIn.timestamp);
          result.push(lastAddedCheckIn);
          lastAddedCheckIn.timestamp = currentTimeOfDay;
        }
        currentTimeOfDay = new Date(currentTimeOfDay.valueOf() + TIME_INTERVAL);
      }

      resolve(result);
    });
  }

  createObjectCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
};

/*
    for (const row of rows) {
      row.timestamp = new Date(row.timestamp);

      const isCheckinType = row.type === 'check-in';
      if (isCheckinType) {
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

 */
