import DataOperationProxy from './DataOperationProxy';
import IDataOperation from '../domain/IDataOperation';
import { Methods, OperationIds } from '../Constants';
import { Channels } from '../../main/preload';
import IpcRendererImpl from '../../renderer/DataHandling/IpcRendereImpl';
import DataOperationErrorLogger from './DataOperationErrorLogger';
import { ClientRequestor } from '../domain/ClientRequestor';
import IDataOperationChainController from '../domain/IDataOperationController';

export default class DataOperationChainControllerProxy
  implements IDataOperationChainController {
  private dataOperations: Map<string, IDataOperation>;

  readonly channel: Channels = <Channels>'ipc-chain-controller';

  readonly ipc: ClientRequestor;

  readonly objectId: string = 'data-operation-chain-controller';

  constructor(ipc: ClientRequestor) {
    this.ipc = ipc;
    this.dataOperations = new Map<string, IDataOperation>();
  }

  createOperationNode(type: OperationIds, id: string): Promise<IDataOperation> {
    return new Promise<IDataOperation>(async (resolve, reject) => {
      if (!this.ipc) return reject(new Error('IPC not available'));
      await this.ipc.invoke(
        this.channel,
        this.objectId,
        Methods.CHAIN_CONTROLLER_CREATE_OPERATION_NODE,
        type,
        id
      );
      resolve(
        new DataOperationErrorLogger(new DataOperationProxy(id, this.ipc))
      );
    });
  };

  getOperationByNodeId(id: string): Promise<IDataOperation> {
    // eslint-disable-next-line consistent-return
    return new Promise<IDataOperation>((resolve, reject) => {
      if (!this.ipc) return reject(new Error('IPC not available'));
      this.ipc
        .invoke(
          this.channel,
          this.objectId,
          Methods.CHAIN_CONTROLLER_GET_OPERATION_BY_NODE_ID,
          id
        )
        .then(() => {
          resolve(
            new DataOperationErrorLogger(new DataOperationProxy(id, this.ipc))
          );
        });
    });
  }

  removeNodeById(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.ipc) return reject(new Error('IPC not available'));
      this.ipc
        .invoke(
          this.channel,
          this.objectId,
          Methods.CHAIN_CONTROLLER_REMOVE_NODE_BY_ID,
          id
        )
        .then(() => {
          this.dataOperations.delete(id);
          resolve();
        });
    });
  }

  connectOperationNodes(sourceId: string, targetId: string): Promise<void> {
    // eslint-disable-next-line consistent-return
    return new Promise<void>((resolve, reject) => {
      if (!this.ipc) return reject(new Error('IPC not available'));
      this.ipc
        .invoke(
          this.channel,
          this.objectId,
          Methods.CHAIN_CONTROLLER_CONNECT_OPERATION_NODES,
          sourceId,
          targetId
        )
        .then(() => {
          resolve();
        });
    });
  }
}
