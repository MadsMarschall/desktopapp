import DataOperationChainControllerProxy from '../../shared/datatools/DataOperationChainControllerProxy';
import IDataOperationChainController from '../../shared/domain/IDataOperationController';
import IPCMock from '../doubles/IPCMock';
import InvokerSpy from '../doubles/InvokerSpy';
import { Methods, OperationIds } from '../../shared/Constants';
import { Channels } from '../../main/preload';
import ChainControllerErrorLogger from '../../shared/datatools/ChainControllerErrorLogger';

let ipcRenderer: IPCMock;

let chainControllerProxy: IDataOperationChainController;
let invokerSpy: InvokerSpy;
let spyStoredData: any[];
beforeEach(() => {
  spyStoredData = [];
  invokerSpy = new InvokerSpy(spyStoredData);
  ipcRenderer = new IPCMock(invokerSpy);
  chainControllerProxy = new ChainControllerErrorLogger(
    new DataOperationChainControllerProxy(ipcRenderer)
  );
});

test('should pass arguments to invoker: createOperationNode', () => {
  chainControllerProxy.createOperationNode(OperationIds.TIME_SLIDER, 'test-id');
  expect(spyStoredData).toEqual([
    <Channels>'ipc-chain-controller',
    Methods.CHAIN_CONTROLLER_CREATE_OPERATION_NODE,
    [OperationIds.TIME_SLIDER,'test-id'],
  ]);
});

test('should pass arguments to invoker: getOperationByNodeId', () => {
  chainControllerProxy.getOperationByNodeId('test-id');
  expect(spyStoredData).toEqual([
    <Channels>'ipc-chain-controller',
    Methods.CHAIN_CONTROLLER_GET_OPERATION_BY_NODE_ID,
    ['test-id'],
  ]);
});

test('should pass arguments to invoker: removeNodeById', () => {
  chainControllerProxy.removeNodeById('test-id');
  expect(spyStoredData).toEqual([
    <Channels>'ipc-chain-controller',
    Methods.CHAIN_CONTROLLER_REMOVE_NODE_BY_ID,
    ['test-id'],
  ]);
});

test('should pass arguments to invoker: connectOperationNodes', () => {
  chainControllerProxy.connectOperationNodes('test-id-1', 'test-id-2');
  expect(spyStoredData).toEqual([
    <Channels>'ipc-chain-controller',
    Methods.CHAIN_CONTROLLER_CONNECT_OPERATION_NODES,
    ['test-id-1', 'test-id-2'],
  ]);
});
