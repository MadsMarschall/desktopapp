import { Connection } from 'react-flow-renderer';
import DataOperationChainControllerProxy from '../../shared/datatools/DataOperationChainControllerProxy';
import IDataOperation from '../../shared/domain/IDataOperation';
import IpcRendererImpl from './IpcRendereImpl';
import { IPCEvents, Methods } from '../../shared/Constants';

const dataOperationChainControllerProxy = new DataOperationChainControllerProxy(
  new IpcRendererImpl()
);
export const handleTargetNodeConnection = async (
  connection: Connection,
  targetOperation: IDataOperation
) => {
  targetOperation.setSource(

    await dataOperationChainControllerProxy.getOperationByNodeId(
      <string>connection.source
    )
  );
  await targetOperation.getSource().then(source => {
    source.setTarget(targetOperation);
  })
  targetOperation.retriggerOperationChainForward();
};

export const handleSourceNodeConnection = async (
  connection: Connection,
  sourceOperation: IDataOperation
) => {
  sourceOperation.setTarget(
    await dataOperationChainControllerProxy.getOperationByNodeId(
      <string>connection.target
    )
  );
  await sourceOperation.getTarget().then(target => {
    target.setSource(sourceOperation);
  })
  //sourceOperation.retriggerOperationChainForward();
};

export const listenForMethods = (id:string,methods:Methods[], callback:(data:any)=>void) => {
  methods.forEach(method => {
    const settingsChannel = IPCEvents.UPDATE_BY_ID_AND_METHOD+id+method
    window.electron.ipcRenderer.on(settingsChannel,
      (event:any, data:any) => {
        callback(data);
      }
    );
  });

}
