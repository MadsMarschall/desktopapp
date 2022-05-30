/* eslint-disable */

import DataOperationProxy from '../../shared/datatools/DataOperationProxy';
import IPCMock from '../doubles/IPCMock';
import InvokerSpy from '../doubles/InvokerSpy';
import { Methods } from '../../shared/Constants';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import DataOperationSpy from '../doubles/DataOperationSpy';
import DataOperationErrorLogger from '../../shared/datatools/DataOperationErrorLogger';
import DataOperationErrorObject from '../doubles/DataOperationErrorObject';

let dop: DataOperationErrorLogger;
let ipc: IPCMock;
let invokerMock: InvokerSpy
let spy: unknown[];
beforeEach(() => {
  spy = [];
  invokerMock = new InvokerSpy(spy);
  ipc = new IPCMock(invokerMock);
  dop = new DataOperationErrorLogger(new DataOperationErrorObject());
});

test('resolves on error in response: getSource ', async () => {
  await expect(dop.getSource()).resolves.not.toThrow();
});

test('resolves on error in response: getTarget ', async () => {
  await expect(dop.getTarget()).resolves.not.toThrow();
});

test('resolves on error in response: getData ', async () => {
  await expect(dop.getData()).resolves.not.toThrow();
});

test('resolves on error in response: getType ', async () => {
  await expect(dop.getType()).resolves.not.toThrow();
});

test('resolves on error in response: retriggerOperationChainBackward ', async () => {
  await expect(dop.retriggerOperationChainBackward()).resolves.not.toThrow();
});

test('resolves on error in response: retriggerOperationChainForward ', async () => {
  await expect(dop.retriggerOperationChainForward()).resolves.not.toThrow();
});

test('resolves on error in response: setSettings ', async () => {
  await expect(dop.setSettings([])).resolves.not.toThrow();
});

test('resolves on error in response: setSource ', async () => {
  await expect(dop.setSource(new IsNullObject())).resolves.not.toThrow();
});

test('resolves on error in response: setTarget ', async () => {
  await expect(dop.setTarget(new IsNullObject())).resolves.not.toThrow();
});

test('resolves on error in response: triggerOperation ', async () => {
  await expect(dop.triggerOperation()).resolves.not.toThrow();
});
