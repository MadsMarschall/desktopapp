import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import IDataOperation from '../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../shared/domain/Interfaces';

export default class DataSourceStub implements IDataOperation {
  retriggerOperationChainForward(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setTarget(target: IDataOperation): void {
    throw new Error('Method not implemented.');
  }

  getTarget(): IDataOperation {
    throw new Error('Method not implemented.');
  }

  getData(): IDataPointMovement[] {
    return [
      {
        PersonId: 0,
        X: 0,
        Y: 0,
        affectedRows: 0,
        id: '1',
        timestamp: new Date('2014-06-07 00:00:01'),
        type: '',
      },
      {
        PersonId: 0,
        X: 0,
        Y: 0,
        affectedRows: 0,
        id: '2',
        timestamp: new Date('2014-06-07 00:00:10'),
        type: '',
      },
      {
        PersonId: 0,
        X: 0,
        Y: 0,
        affectedRows: 0,
        id: '3',
        timestamp: new Date('2014-06-07 00:01:01'),
        type: '',
      },
      {
        PersonId: 0,
        X: 0,
        Y: 0,
        affectedRows: 0,
        id: '4',
        timestamp: new Date('2014-06-07 00:02:01'),
        type: '',
      },
      {
        PersonId: 0,
        X: 0,
        Y: 0,
        affectedRows: 0,
        id: '5',
        timestamp: new Date('2014-06-07 00:03:01'),
        type: '',
      },
    ];
  }

  getSource(): IDataOperation {
    return new IsNullObject();
  }

  getType(): string {
    return '';
  }

  retriggerOperationChainBackwards(): Promise<void> {
    return Promise.resolve(undefined);
  }

  setSettings(settings: any[]): boolean {
    return false;
  }

  setSource(source: IDataOperation): void {}

  triggerOperation(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
