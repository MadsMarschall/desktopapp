import levenshtein from 'js-levenshtein';
import { expose } from 'threads/worker';


const levenshteinWorker = {
  calculateArray: (target:string,trajectories: string[]):number[] => {
    const result = new Array<number>();
    for (const trajectory of trajectories) {
      const distance = levenshtein(target,trajectory);
      result.push(distance);
    }
    return result;
  },
  calculateLevenstheinDistance: (trajectory1: string, trajectory2: string):number => {
    return levenshtein(trajectory1, trajectory2);
  }
}
export type LevenshteinWorker = typeof levenshteinWorker

expose(levenshteinWorker)
