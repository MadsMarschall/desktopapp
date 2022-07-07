import { expose } from 'threads/worker';
import levenshteinDistanceNumbers from './levensteinNumberTest';


const levenshteinWorker = {
  calculateArray: (target:number[],trajectories: Array<number[]>):number[] => {
    const result = new Array<number>();
    for (const trajectory of trajectories) {
      const distance = levenshteinDistanceNumbers(target,trajectory);
      result.push(distance);
    }
    return result;
  },
  calculateLevenstheinDistance: (trajectory1: number[], trajectory2: number[]):number => {
    return levenshteinDistanceNumbers(trajectory1, trajectory2);
  }
}
export type LevenshteinWorker = typeof levenshteinWorker

expose(levenshteinWorker);
