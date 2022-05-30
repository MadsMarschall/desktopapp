import { Edge } from 'react-flow-renderer';
import IDataOperation from './IDataOperation';
import { OperationIds } from '../Constants';

export default interface IDataOperationChainController {
  createOperationNode(type: OperationIds, id: string): Promise<IDataOperation>;

  getOperationByNodeId(id: string): Promise<IDataOperation>;

  removeNodeById(id: string): Promise<void>;

  connectOperationNodes(sourceId: string, targetId: string): Promise<void>;
}
