import IDataOperationChainController from 'shared/domain/IDataOperationController';
import DataOperationProxy from './DataOperationProxy';
import IDataOperation from '../../shared/domain/IDataOperation';
import { OperationIds } from '../../shared/Constants';

export default class DataOperationChainControllerProxy
  implements IDataOperationChainController
{
  private dataOperations: Map<string, IDataOperation>;

  constructor() {
    this.dataOperations = new Map<string, IDataOperation>();
  }

  createOperationNode(type: OperationIds, id: string): IDataOperation {
    window.DataOperationChainController.createOperationNode(type, id);
    return new DataOperationProxy(id);
  }

  getOperationByNodeId(id: string): IDataOperation {
    window.DataOperationChainController.getOperationByNodeId(id);
    return new DataOperationProxy(id);
  }

  removeNodeById(id: string) {
    this.dataOperations.delete(id);
  }

  connectOperationNodes(sourceId: string, targetId: string): void {}
}

export const dataOperationChainControllerProxy =
  new DataOperationChainControllerProxy();
