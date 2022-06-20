import { IDataPointMovement } from '../shared/domain/Interfaces';
import { IRideDetails } from './createPersonTrajectoriesWithRideDetails';

export default class DataPreProcessor {

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
          const ride = rides.find((ride: IRideDetails) => ride.X === row.X && ride.Y === row.Y);
          if (ride) {
            row.rideId = ride.parkguide;
          }
          row.timestamp = this.roundTime(row);
          formattedTrajectory.push(row);
        }

        rides.forEach((ride) => {
          let distanceToRide = Math.sqrt(Math.pow(row.X - ride.X, 2) + Math.pow(row.Y - ride.Y, 2));
          if (distanceToRide <= DISTANCE_THRESHHOLD) {
            row.X = ride.X;
            row.Y = ride.Y;
            row.rideId = ride.parkguide;
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
          id: 'calculatedEntry_' + trajectory[0].PersonId + '_' + timestamp,
          rideId: -99,
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
