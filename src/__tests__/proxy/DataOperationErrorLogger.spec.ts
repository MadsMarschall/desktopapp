/* eslint-disable */

import DataOperationProxy from '../../shared/datatools/DataOperationProxy';
import IPCMock from '../doubles/IPCMock';
import InvokerSpy from '../doubles/InvokerSpy';
import { Methods } from '../../shared/Constants';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import DataOperationSpy from '../doubles/DataOperationSpy';
import DataOperationErrorLogger from '../../shared/datatools/DataOperationErrorLogger';

let dop: DataOperationErrorLogger;
let ipc: IPCMock;
let invokerMock: InvokerSpy
let spy: unknown[];
beforeEach(() => {
  spy = [];
  invokerMock = new InvokerSpy(spy);
  ipc = new IPCMock(invokerMock);
  dop = new DataOperationErrorLogger(new DataOperationProxy('test', ipc));
});

test('can get objectId', async () => {
  expect(await dop.getId()).toBe('test');
});

test("should send pass arugments to invoker: getData", () => {
  dop.getData();
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATA_OPERATION_GET_DATA,
    [[]]
  ]);
});

test("should send pass arugments to invoker: getType", () => {
  dop.getType();
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATAOPERATION_GET_TYPE,
    [[]]
  ]);
});

test("should send pass arugments to invoker: triggerOperation", () => {
  dop.triggerOperation();
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATA_OPERATION_TRIGGER_OPERATION,
    [[]]
  ]);
});

test("should send pass arugments to invoker: retriggerOperationChainForward", () => {
  dop.retriggerOperationChainForward();
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD,
    [[]]
  ]);
});

test("should send pass arugments to invoker: retriggerOperationChainBackward", () => {
  dop.retriggerOperationChainBackward();
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD,
    [[]]
  ]);
});

test("should send pass arugments to invoker: getSource", () => {
  dop.getSource();
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATA_OPERATION_GET_SOURCE,
    [[]]
  ]);
});

test("should send pass arugments to invoker: getTarget", () => {
  dop.getTarget();
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATA_OPERATION_GET_TARGET,
    [[]]
  ]);
});

test("should send pass arugments to invoker: setSettings", () => {
  dop.setSettings([1, 2]);
  expect(spy).toEqual([
    "ipc-data-operation",
    Methods.DATA_OPERATION_SET_SETTINGS,
    [1,2]
  ]);
});

test("should send pass arugments to invoker: setTarget", async () => {
  let dataOperationSpy = new DataOperationSpy(spy);
  await dataOperationSpy.setId("TEST_TEST")
  await dop.setTarget(dataOperationSpy).then(() => {
    console.log(spy);
    expect(spy).toEqual([
      dataOperationSpy.getId.name,
      "ipc-data-operation",
      Methods.DATA_OPERATION_SET_TARGET,
      ["TEST_TEST"]
    ]);
  });
});

test("should send pass arugments to invoker: setSource", async () => {
  let dataOperationSpy = new DataOperationSpy(spy);
  await dataOperationSpy.setId("TEST_TEST_2")
  await dop.setSource(dataOperationSpy);
  expect(spy).toEqual([
    dataOperationSpy.getId.name,
    "ipc-data-operation",
    Methods.DATA_OPERATION_SET_SOURCE,
    ["TEST_TEST_2"]
  ]);
});
