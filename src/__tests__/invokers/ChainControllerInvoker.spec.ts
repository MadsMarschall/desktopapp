/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import IInvoker from '../../shared/domain/IInvoker';
import DataOperationChainControllerInvoker from '../../main/datahandling/invokers/DataOperationChainControllerInvoker';
import DataOperationChainControllerSpy from '../doubles/DataOperationChainControllerSpy';
import { Methods, OperationIds } from '../../shared/Constants';

let ChainControllerInvoker: IInvoker;
let spy: DataOperationChainControllerSpy;
let spyStorage: any[];
beforeEach(() => {
  spyStorage = [];
  spy = new DataOperationChainControllerSpy(spyStorage);
  ChainControllerInvoker = new DataOperationChainControllerInvoker(spy);
});

test('should invoke node connection method', () => {
  ChainControllerInvoker.handleRequest(
    'test',
    Methods.CHAIN_CONTROLLER_CONNECT_OPERATION_NODES,
    "sourceId" ,"targetId"
  );
  expect(spyStorage).toEqual(
    [
      "sourceId",
      "targetId",
      spy.connectOperationNodes.name
    ],
  );
});

test('should invoke getOperationByNodeId', () => {
  ChainControllerInvoker.handleRequest(
    'test',
    Methods.CHAIN_CONTROLLER_GET_OPERATION_BY_NODE_ID,
    "nodeId"
  );
  expect(spyStorage).toEqual(
    [
      "nodeId",
      spy.getOperationByNodeId.name
    ],
  );
});

test('should invoke removeNodeById', () => {
  ChainControllerInvoker.handleRequest(
    'test',
    Methods.CHAIN_CONTROLLER_REMOVE_NODE_BY_ID,
    "operationId"
  );
  expect(spyStorage).toEqual(
    [
      "operationId",
      spy.removeNodeById.name
    ],
  );
});

test('should invoke removeOperationById', () => {
  ChainControllerInvoker.handleRequest(
    'test',
    Methods.CHAIN_CONTROLLER_CREATE_OPERATION_NODE,
    OperationIds.SELECT_FROM_DB,
    "nodeid",
  );
  expect(spyStorage).toEqual(
    [
      OperationIds.SELECT_FROM_DB,
      "nodeid",
      spy.createOperationNode.name
    ],
  );
});


test("should reject promise if method is not supported", () => {
  expect(async () => {
    await ChainControllerInvoker.handleRequest(
      'test',
      Methods.DATA_OPERATION_GET_DATA,
      "nodeid",
    );
  }).rejects.toEqual(new Error("Method 0 not found"));
});
