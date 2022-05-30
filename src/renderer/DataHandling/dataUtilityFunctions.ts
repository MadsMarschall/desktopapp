import { Connection } from 'react-flow-renderer';
import DataOperationChainControllerProxy from '../../shared/datatools/DataOperationChainControllerProxy';
import IDataOperation from '../../shared/domain/IDataOperation';
import IpcRendererImpl from './IpcRendereImpl';

const dataOperationChainControllerProxy = new DataOperationChainControllerProxy(
  new IpcRendererImpl()
);
export const handleTargetNodeConnection = async (
  connection: Connection,
  targetOperation: IDataOperation
) => {
  console.log(await dataOperationChainControllerProxy.getOperationByNodeId(
    <string>connection.source
  ));
  targetOperation.setSource(

    await dataOperationChainControllerProxy.getOperationByNodeId(
      <string>connection.source
    )
  );
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
  await sourceOperation.retriggerOperationChainForward();
};
