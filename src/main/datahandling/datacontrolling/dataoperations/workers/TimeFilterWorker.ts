import { IDataPointMovement } from '../../../../../shared/domain/Interfaces';
interface IWorkerInput {
    data: IDataPointMovement[];
    lowerBound: number;
    upperBound: number;
}
export default async ({ data,lowerBound,upperBound }:IWorkerInput) => {
  return data.filter((dataPoint) => {
    return dataPoint.timestamp.valueOf() >= lowerBound && dataPoint.timestamp.valueOf() <= upperBound;
  });
};
