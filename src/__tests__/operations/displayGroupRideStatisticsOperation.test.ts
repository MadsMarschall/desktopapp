import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import DataOperationSpy from '../doubles/DataOperationSpy';
import { dbController } from '../../main/datahandling/utilities/DataBaseController';
import CreateGroupsFromMatrixOperation from '../../main/datahandling/datacontrolling/dataoperations/CreateGroupsFromMatrixOperation';
import { count } from '@tidyjs/tidy';
import DisplayGroupRideStatisticsOperation
  from '../../main/datahandling/datacontrolling/dataoperations/DisplayGroupRideStatisticsOperation';
jest.setTimeout(30000);
let groupTimelineOperation: DisplayGroupRideStatisticsOperation;
let spyOperation: DataOperationSpy;
let spyStorage: unknown[] = [];
let gfmOperation: CreateGroupsFromMatrixOperation;
beforeEach(() => {
  spyStorage = [];
  spyOperation = new DataOperationSpy(spyStorage);
  gfmOperation = new CreateGroupsFromMatrixOperation(new IsNullObject(), 'gfm');
  groupTimelineOperation = new DisplayGroupRideStatisticsOperation(gfmOperation, 'test');
})

test('should return the correct number of groups', async () => {
  const row = {
    "members": "941,78603,518531,711179,1823484",
    "groupId": 2,
    "numberOfMembers": 5
  }
  await gfmOperation.setSettings([5, [row]]);
  await gfmOperation.triggerOperation();
  await groupTimelineOperation.triggerOperation();
  const result = await groupTimelineOperation.getDisplayableData();
  console.log(result);
})


