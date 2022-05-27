import IObserver from '../../../shared/domain/IObserver';

export default class Observer implements IObserver {
  private readonly updateMethod: () => void;

  constructor(updateMethod: () => void) {
    this.updateMethod = updateMethod;
  }

  update(): void {
    this.updateMethod();
  }
}
