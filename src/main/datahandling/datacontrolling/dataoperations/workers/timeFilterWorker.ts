import { IDataPointMovement } from '../../../../../shared/domain/Interfaces';
import { expose } from 'threads/worker';

const filterWorker = {
  filterByTime: (data:IDataPointMovement[], lowerBound:number, upperBound:number) => {
    return data.filter(
      (dataPoint: IDataPointMovement) =>
        dataPoint.timestamp.valueOf() >= lowerBound && dataPoint.timestamp.valueOf() <= upperBound
    );
  }
};

export type  FilterWorker = typeof filterWorker

expose(filterWorker);
