import { TableNames } from '../Constants';

export interface ICSVInputObject {
  Timestamp: string;
  id: number;
  type: string;
  X: string;
  Y: string;
}
export interface IDistanceMatrixPoint {
  Person_1: number;
  Person_2: number;
  distance: number;
}
export interface IRow {
  groupId:number,
  members: string,
  numberOfMembers: number,
}

export interface IRideDataStatistics{
  rideId:number
  countOfRideEntries:number
}

export interface IDataPointMovement {
  timestamp: Date;
  PersonId: number;
  type: string;
  X: number;
  Y: number;
  id: string;
  affectedRows: number;
  clusterId?: number;
  clusterCenterPostion?: { x:number,y:number }
  rideId?: number;
}

export interface PersonDataEvent {
  timestamp: Date;
  X: number;
  Y: number;
}

export interface PersonData {
  id: number;
  events: PersonDataEvent[];
}
