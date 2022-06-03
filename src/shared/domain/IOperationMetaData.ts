import IDataOperation from './IDataOperation';
import { Chart, ChartData, ChartDataset, ChartTypeRegistry } from 'chart.js';

export interface IDisplayableData {
  id: string,
  name: string,
  settings: unknown[],
  entries: number,
  sourceOperationId: string,
  targetOperationId: string,
  clusterPositions?: IClusterPosition[],
  charjsData?: ChartData<keyof ChartTypeRegistry,ChartDataset, string[]>,
  boundaries?: number[],
}


export interface IClusterPosition {
    x: number,
    y: number,
    dimension: number,
    parts: number[]
  }
