import { Connection } from 'react-flow-renderer';
import { dataOperationChainControllerProxy } from './DataOperationChainControllerProxy';
import IDataOperation from '../../shared/domain/IDataOperation';

export const handleTargetNodeConnection = (
  connection: Connection,
  targetOperation: IDataOperation
) => {
  targetOperation.setSource(
    dataOperationChainControllerProxy.getOperationByNodeId(
      <string>connection.source
    )
  );
  targetOperation.retriggerOperationChainForward();
};

export const handleSourceNodeConnection = (
  connection: Connection,
  sourceOperation: IDataOperation
) => {
  sourceOperation.setTarget(
    dataOperationChainControllerProxy.getOperationByNodeId(
      <string>connection.target
    )
  );
  sourceOperation.retriggerOperationChainForward();
};
