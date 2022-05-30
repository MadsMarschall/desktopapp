import IDataOperationChainController from '../../shared/domain/IDataOperationController';
import { OperationIds } from '../../shared/Constants';
import IDataOperation from '../../shared/domain/IDataOperation';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';

export default class ChainControllerErrorLogger
  implements IDataOperationChainController
{
  private chainController: IDataOperationChainController;

  constructor(nextChainController: IDataOperationChainController) {
    this.chainController = nextChainController;
  }

  connectOperationNodes(sourceId: string, targetId: string): Promise<void> {
    return this.chainController
      .connectOperationNodes(sourceId, targetId)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createOperationNode(type: OperationIds, id: string): Promise<IDataOperation> {
    return this.chainController
      .createOperationNode(type, id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        // eslint-disable-next-line promise/no-return-wrap
        return Promise.resolve(new IsNullObject());
      });
  }

  getOperationByNodeId(id: string): Promise<IDataOperation> {
    return this.chainController
      .getOperationByNodeId(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        // eslint-disable-next-line promise/no-return-wrap
        return Promise.resolve(new IsNullObject());
      });
  }

  removeNodeById(id: string): Promise<void> {
    return this.chainController
      .removeNodeById(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        // eslint-disable-next-line promise/no-return-wrap
        return Promise.resolve();
      });
  }
}
