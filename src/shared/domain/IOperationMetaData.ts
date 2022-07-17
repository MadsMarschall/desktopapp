import IDataOperation from './IDataOperation';
import { Chart, ChartData, ChartDataset, ChartTypeRegistry } from 'chart.js';
import { IDistanceMatrixPoint, IRideDataStatistics } from './Interfaces';

export interface IDisplayableData {
  id: string,
  name: string,
  settings: unknown[],
  entries: number,
  sourceOperationId: string,
  targetOperationId: string,
  clusterPositions?: IClusterPosition[],
  rideDataStatistics?: IRideDataStatistics[],
  charjsData?: ChartData<keyof ChartTypeRegistry,ChartDataset, string[]>,
  boundaries?: number[],
  groups?: unknown[][],
}


export interface IClusterPosition {
    x: number,
    y: number,
    dimension: number,
    parts: number[]
  }
