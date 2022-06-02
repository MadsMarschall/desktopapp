import IDataOperationChainController from '../../../shared/domain/IDataOperationController';
import IInvoker from '../../../shared/domain/IInvoker';
import IDataOperation from '../../../shared/domain/IDataOperation';
import {ipcMain} from 'electron';
import { IPCEvents, Methods } from '../../../shared/Constants';
import {BrowserWindow} from 'electron';

export default class DataOperationInvoker implements IInvoker {
  private dataOperationChainController: IDataOperationChainController;

  constructor(dataOperationChainController: IDataOperationChainController) {
    this.dataOperationChainController = dataOperationChainController;
  }

  public async handleRequest(
    id: string,
    method: Methods,
    ...args: any[]
  ): Promise<any> {
    const operation = await this.dataOperationChainController.getOperationByNodeId(id);
    if (!operation) return Promise.reject(new Error('Operation not found'));

    let result: Promise<unknown> = Promise.resolve();
    switch (method) {
      case Methods.DATA_OPERATION_GET_DATA:
        result = operation.getData();
        break;
      case Methods.DATAOPERATION_GET_TYPE:
        result = operation.getType();
        break;
      case Methods.DATA_OPERATION_TRIGGER_OPERATION:
        result = operation.triggerOperation();
        break;
      case Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD:
        result = operation.retriggerOperationChainBackward();
        break;
      case Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD:
        result = operation.retriggerOperationChainForward();
        break;
      case Methods.DATA_OPERATION_GET_SOURCE:
        let sourceOperationId = operation.getSource().then(source => source.getId())
        result = sourceOperationId;
        break;
      case Methods.DATA_OPERATION_GET_TARGET:
        let targetOperationId = operation.getTarget().then(target => target.getId())
        result = targetOperationId;
        break;
      case Methods.DATA_OPERATION_SET_SETTINGS:
        operation.setSettings(args);
        break;
      case Methods.DATA_OPERATION_SET_TARGET:
        // eslint-disable-next-line no-case-declarations
        const targetOperation: IDataOperation =
          await this.dataOperationChainController.getOperationByNodeId(args[0]);
        operation.setTarget(targetOperation);
        break;
      case Methods.DATA_OPERATION_SET_SOURCE:
        // eslint-disable-next-line no-case-declarations
        const sourceOperation: IDataOperation =
          await this.dataOperationChainController.getOperationByNodeId(args[0]);
        operation.setSource(sourceOperation);
        break;
      case Methods.DATA_OPERATION_GET_SETTINGS:
        result = operation.getSettings();
        break;
      case Methods.DATA_OPERATION_GET_META_DATA:
        result = operation.getMetaData();
        break;
      default:
        result = Promise.reject(new Error(`Method ${method} is not supported`));
        break;
    }
    await result.then(()=>{
      if(BrowserWindow){
        console.log('sending update');
        BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send(IPCEvents.UPDATE_BY_ID_AND_METHOD+id+method, id, method);
        });
      }

      let isFowrdTriggerMethod:boolean = Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD === method
      if(!isFowrdTriggerMethod) return;

      if(BrowserWindow && BrowserWindow.getFocusedWindow()){
        console.log('sending update');
        BrowserWindow.getFocusedWindow()!.webContents.send(IPCEvents.UPDATE);
      }
    })

    return result;
  }
}
