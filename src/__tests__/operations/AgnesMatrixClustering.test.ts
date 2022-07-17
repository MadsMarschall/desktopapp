import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import DataOperationSpy from '../doubles/DataOperationSpy';
import { dbController } from '../../main/datahandling/utilities/DataBaseController';
import CreateGroupsFromMatrixOperation from '../../main/datahandling/datacontrolling/dataoperations/CreateGroupsFromMatrixOperation';
import { count } from '@tidyjs/tidy';
jest.setTimeout(30000);
let groupTimelineOperation: CreateGroupsFromMatrixOperation;
let spyOperation: DataOperationSpy;
let spyStorage: unknown[] = [];
beforeEach(() => {
  spyStorage = [];
  spyOperation = new DataOperationSpy(spyStorage);
  groupTimelineOperation = new CreateGroupsFromMatrixOperation(spyOperation, 'test');
})

test('can set settings', async () => {
  await groupTimelineOperation.setSettings([200]);
  expect(await groupTimelineOperation.getSettings()).toEqual([1]);
})

test('can load matrix from db', async () => {
  await groupTimelineOperation.setSettings([1]);
  const distanceMatrix = await groupTimelineOperation.loadDataFromDB();
  expect(distanceMatrix.length).toBeGreaterThan(10);
})

test('if high threshold it should group all into 1 cluster', async () => {
  await groupTimelineOperation.setSettings([200]);
  const distanceMatrix = await groupTimelineOperation.loadDataFromDB();
  const groups = await groupTimelineOperation.createGroups(distanceMatrix);
  expect(groups.length).toEqual(1);
  expect(groups[0].length).toEqual(6411);
})

test('if lower threshold it should group into multiple clusters', async () => {
  await groupTimelineOperation.setSettings([5]);
  const distanceMatrix = await groupTimelineOperation.loadDataFromDB();
  const groups = await groupTimelineOperation.createGroups(distanceMatrix);
  expect(groups.length).toBeGreaterThan(10);
  expect(groups[0].length).toBeLessThan(6411);

})
