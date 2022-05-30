import IDataOperationChainController from "shared/domain/IDataOperationController";
import { OperationIds } from '../../../shared/Constants';
import IDataOperation from '../../../shared/domain/IDataOperation';

export default class ChainControllerLoggerDecorator implements IDataOperationChainController {
  private chainController: IDataOperationChainController;

  constructor(chainController: IDataOperationChainController) {
    this.chainController = chainController;
  }
  connectOperationNodes(sourceId: string, targetId: string): Promise<void> {
    console.log(`[${this.connectOperationNodes.name}] Connecting operation nodes with sourceId: ${sourceId} and targetId: ${targetId}`);
    return this.chainController.connectOperationNodes(sourceId, targetId);
  }

  createOperationNode(type: OperationIds, id: string): Promise<IDataOperation> {
    console.log(`[${this.createOperationNode.name}] Creating operation node with type: ${type} and id: ${id}`);
    return this.chainController.createOperationNode(type, id);
  }

  getOperationByNodeId(id: string): Promise<IDataOperation> {
    console.log(`[${this.getOperationByNodeId.name}] Getting operation by node id: ${id}`);
    return this.chainController.getOperationByNodeId(id);
  }

  removeNodeById(id: string): Promise<void> {
    console.log(`[${this.removeNodeById.name}] Removing node by id: ${id}`);
    return this.chainController.removeNodeById(id);
  }

}
