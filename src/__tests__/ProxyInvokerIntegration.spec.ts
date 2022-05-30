import IPCMock from './doubles/IPCMock';
import IInvoker from '../shared/domain/IInvoker';
import DataOperationInvoker from '../main/datahandling/invokers/DataOperationInvoker';
import DataOperationChainControllerSpy from './doubles/DataOperationChainControllerSpy';
import IDataOperationProxy from '../shared/domain/IDataOperationProxy';
import DataOperationProxy from '../shared/datatools/DataOperationProxy';
import DataOperationSpy from './doubles/DataOperationSpy';
import DataOperationErrorLogger from '../shared/datatools/DataOperationErrorLogger';

let ipcStub: IPCMock;
let invoker: IInvoker;
let chainControllerSpy: DataOperationChainControllerSpy;
let spyStore: unknown[];
let operationSpy: DataOperationSpy
let operationProxy: IDataOperationProxy;
beforeEach(() => {
  spyStore = [];
  operationSpy = new DataOperationSpy(spyStore);
  chainControllerSpy = new DataOperationChainControllerSpy([]);
  chainControllerSpy.setSpyForOperation(operationSpy)
  invoker = new DataOperationInvoker(chainControllerSpy);
  ipcStub = new IPCMock(invoker);
  operationProxy = new DataOperationErrorLogger(
    new DataOperationProxy('test-objectId', ipcStub)
  );
});

test('should call method on remote object: getData', async () => {
  await operationProxy.getData();
  expect(spyStore).toEqual([operationSpy.getData.name]);
});

test('should call method on remote object: getType', async () => {
 await operationProxy.getType();
  expect(spyStore).toEqual([operationSpy.getType.name]);
});

test('should call method on remote object: setSettings', async () => {
  await operationProxy.setSettings([1, 2]);
  expect(spyStore).toEqual([operationSpy.setSettings.name]);
});

test('should call method on remote object: triggerOperation', async () => {
  await operationProxy.triggerOperation();
  expect(spyStore).toEqual([operationSpy.triggerOperation.name]);
});

test('should call method on remote object: retriggerOperationChainBackward', async () => {
  await operationProxy.retriggerOperationChainBackward();
  expect(spyStore).toEqual([operationSpy.retriggerOperationChainBackward.name]);
});

test('should call method on remote object: retriggerOperationChainForward', async () => {
  await operationProxy.retriggerOperationChainForward();
  expect(spyStore).toEqual([operationSpy.retriggerOperationChainForward.name]);
});

test('should call method on remote object: setSource', async () => {
  let spy = []
  await operationProxy.setSource(new DataOperationSpy(spy));
  expect(spyStore).toEqual([operationSpy.setSource.name]);
});

test('should call method on remote object: setTarget', async () => {
  let spy = []
  await operationProxy.setTarget(new DataOperationSpy(spy));
  expect(spyStore).toEqual([operationSpy.setTarget.name]);
});

test('should call method on remote object: getTarget', async () => {
  await operationProxy.getTarget();
  expect(spyStore).toEqual([operationSpy.getTarget.name]);
});
