/* eslint-disable*/
import DataOperationInvoker from '../../main/datahandling/invokers/DataOperationInvoker';
import DataOperationChainControllerSpy from '../doubles/DataOperationChainControllerSpy';
import { Methods } from '../../shared/Constants';
import DataOperationSpy from '../doubles/DataOperationSpy';


let dataOperationInvoker: DataOperationInvoker;
let spy: DataOperationChainControllerSpy;
let chainControllerSpyStorage:unknown[];
let dataOperationSpyStorage:unknown[];

let dataOperationSpy: DataOperationSpy;
beforeEach(() => {
    chainControllerSpyStorage = [];
    dataOperationSpyStorage = [];

    dataOperationSpy = new DataOperationSpy(dataOperationSpyStorage);
    spy = new DataOperationChainControllerSpy(chainControllerSpyStorage);
    spy.setSpyForOperation(dataOperationSpy);
    dataOperationInvoker = new DataOperationInvoker(spy);
});

test('should invoke getData', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_GET_DATA,{});
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.getData.name
    ]);
});

test('should invoke getType', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATAOPERATION_GET_TYPE,{});
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.getType.name
    ]);
});

test('should invoke setSettings', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_SET_SETTINGS,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.setSettings.name
    ]);
});

test('should invoke triggerOperation', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_TRIGGER_OPERATION,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.triggerOperation.name
    ]);
});

test('should invoke retriggerOperationChainForward', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.retriggerOperationChainForward.name
    ]);
});

test('should invoke retriggerOperationChainBackward', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.retriggerOperationChainBackward.name
    ]);
});
test('should invoke setSource', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_SET_SOURCE,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.setSource.name
    ]);
});

test('should invoke getSource', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_GET_SOURCE,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.getSource.name,
      dataOperationSpy.getId.name
    ]);
});

test('should invoke setTarget', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_SET_TARGET,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.setTarget.name
    ]);
});

test('should invoke getTarget', async () => {
    await dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_GET_TARGET,"arg1","arg");
    expect(dataOperationSpyStorage).toEqual([
      dataOperationSpy.getTarget.name,
      dataOperationSpy.getId.name
    ]);
});

test("should reject promise if method is not supported", () => {
  expect(async () => {
    await dataOperationInvoker.handleRequest(
      'test',
      Methods.CHAIN_CONTROLLER_CREATE_OPERATION_NODE,
      "nodeid",
    );
  }).rejects.toEqual(new Error("Method 0 not found"));
});

test("should return objectId on getTarget", async () => {
  dataOperationSpy.setId("testid_123");
  const result = await dataOperationInvoker.handleRequest(
    'test',
    Methods.DATA_OPERATION_GET_TARGET,
    "nodeid",
  );
  expect(result).toEqual("testid_123");
});

test("should return objectId on getSource", async () => {
  dataOperationSpy.setId("testid_123");
  const result = await dataOperationInvoker.handleRequest(
    'test',
    Methods.DATA_OPERATION_GET_SOURCE,
    "nodeid",
  );
  expect(result).toEqual("testid_123");
});
