import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import IDataOperation from '../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../shared/domain/Interfaces';

export default class DataSourceStub implements IDataOperation {
  retriggerOperationChainForward(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setTarget(target: IDataOperation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getTarget(): Promise<IDataOperation> {
    throw new Error('Method not implemented.');
  }

  getData(): Promise<IDataPointMovement[]> {
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

  getSource(): Promise<IDataOperation> {
    return new IsNullObject();
  }

  getType(): Promise<string> {
    return '';
  }

  retriggerOperationChainBackward(): Promise<void> {
    return Promise.resolve(undefined);
  }

  setSettings(settings: any[]): Promise<boolean> {
    return false;
  }

  setSource(source: IDataOperation): Promise<void> {}

  triggerOperation(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
