import IDataOperationChainController from '../../../shared/domain/IDataOperationController';
import IInvoker from '../../../shared/domain/IInvoker';
import IDataOperation from '../../../shared/domain/IDataOperation';
import { Methods } from '../../../shared/Constants';

export default class DataOperationInvoker implements IInvoker {
  private dataOperationChainController: IDataOperationChainController;

  constructor(dataOperationChainController: IDataOperationChainController) {
    this.dataOperationChainController = dataOperationChainController;
  }

  public handleRequest(
    id: string,
    method: Methods,
    ...args: any[]
  ): Promise<any> {
    const operation =
      this.dataOperationChainController.getOperationByNodeId(id);
    if (!operation) return Promise.resolve();

    let result: any = null;
    switch (method) {
      case Methods.DATA_OPERATION_GET_DATA:
        result = operation.getData();
        break;
      case Methods.DATA_OPERATION_TRIGGER_OPERATION:
        result = operation.triggerOperation();
        break;
      case Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD:
        result = operation.retriggerOperationChainBackwards();
        break;
      case Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD:
        result = operation.retriggerOperationChainForward();
        break;
      case Methods.DATA_OPERATION_GET_SOURCE:
        result = operation.getSource();
        break;
      case Methods.DATA_OPERATION_GET_TARGET:
        result = operation.getTarget();
        break;
      case Methods.DATA_OPERATION_SET_SETTINGS:
        operation.setSettings(args);
        break;
      case Methods.DATA_OPERATION_SET_TARGET:
        // eslint-disable-next-line no-case-declarations
        const targetOperation: IDataOperation =
          this.dataOperationChainController.getOperationByNodeId(args[0]);
        operation.setTarget(targetOperation);
        break;
      case Methods.DATA_OPERATION_SET_SOURCE:
        // eslint-disable-next-line no-case-declarations
        const sourceOperation: IDataOperation =
          this.dataOperationChainController.getOperationByNodeId(args[0]);
        operation.setSource(sourceOperation);
        break;
      default:
        result = new Error(`Method ${method} is not supported`);
        break;
    }
    return result;
  }
}
