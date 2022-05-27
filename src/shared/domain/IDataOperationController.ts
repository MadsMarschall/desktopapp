import { Edge } from 'react-flow-renderer';
import IDataOperation from './IDataOperation';
import { OperationIds } from '../Constants';

export default interface IDataOperationChainController {
  createOperationNode(type: OperationIds, id: string): IDataOperation;

  getOperationByNodeId(id: string): IDataOperation;

  removeNodeById(id: string): void;

  connectOperationNodes(sourceId: string, targetId: string): void;
}
