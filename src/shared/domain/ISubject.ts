import IObserver from './IObserver';

export default interface ISubject {
  notifyObservers(): void;
  addObserver(obs: IObserver): void;
}
