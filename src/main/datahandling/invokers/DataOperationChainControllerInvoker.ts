import IDataOperationChainController from '../../../shared/domain/IDataOperationController';
import IInvoker from '../../../shared/domain/IInvoker';
import { Methods } from '../../../shared/Constants';

export default class DataOperationChainControllerInvoker implements IInvoker {
  private servant: IDataOperationChainController;

  constructor(servant: IDataOperationChainController) {
    this.servant = servant;
  }

  handleRequest(id: string, method: Methods, ...args: any[]): Promise<any> {
    let result: Promise<any>;
    switch (method) {
      case Methods.CHAIN_CONTROLLER_CREATE_OPERATION_NODE:
        result = Promise.resolve(
          this.servant.createOperationNode(args[0], args[1])
        );
        break;
      case Methods.CHAIN_CONTROLLER_GET_OPERATION_BY_NODE_ID:
        result = Promise.resolve(this.servant.getOperationByNodeId(args[0]));
        break;
      case Methods.CHAIN_CONTROLLER_CONNECT_OPERATION_NODES:
        result = Promise.resolve(
          this.servant.connectOperationNodes(args[0], args[1])
        );
        break;
      case Methods.CHAIN_CONTROLLER_REMOVE_NODE_BY_ID:
        result = Promise.resolve(this.servant.removeNodeById(args[0]));
        break;
      default:
        result = Promise.reject(new Error(`Method ${method} not found`));
    }
    return result;
  }
}
