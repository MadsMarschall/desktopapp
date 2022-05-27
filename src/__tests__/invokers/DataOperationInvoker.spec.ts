/* eslint-disable*/
import DataOperationInvoker from '../../main/datahandling/invokers/DataOperationInvoker';
import DataOperationChainControllerSpy from '../doubles/DataOperationChainControllerSpy';
import { Methods } from '../../shared/Constants';


let dataOperationInvoker: DataOperationInvoker;
let spy: DataOperationChainControllerSpy;
let spyStorage:unknown[] = [];
beforeEach(() => {

    spy = new DataOperationChainControllerSpy(spyStorage);
    dataOperationInvoker = new DataOperationInvoker(spy);
});

test('should invoke getData', () => {
    dataOperationInvoker.handleRequest("testid",Methods.DATA_OPERATION_GET_DATA,{});
    expect(spyStorage).toEqual([
      "testid",
      Methods.DATA_OPERATION_GET_DATA,
      spy.getOperationByNodeId.name
    ]);
});
