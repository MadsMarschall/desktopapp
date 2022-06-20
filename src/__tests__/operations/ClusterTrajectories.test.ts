import ClusterTrajectoriesOperation
  from '../../main/datahandling/datacontrolling/dataoperations/ClusterTrajectoriesOperation';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import DataOperationSpy from '../doubles/DataOperationSpy';
import { dbController } from '../../main/datahandling/utilities/DataBaseController';
jest.setTimeout(30000);
let clusterTrajectories: ClusterTrajectoriesOperation;
let spyOperation: DataOperationSpy;
let spyStorage: unknown[] = [];
beforeEach(() => {
  spyStorage = [];
  spyOperation = new DataOperationSpy(spyStorage);
  clusterTrajectories = new ClusterTrajectoriesOperation(spyOperation, 'test');
})

test('can cluster trajectories', async () => {
  const data = await dbController.getAllDataFromTable();
  spyOperation.setData(data);
  await clusterTrajectories.triggerOperation();
})
