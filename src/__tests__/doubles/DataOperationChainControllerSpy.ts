import IDataOperationChainController from '../../shared/domain/IDataOperationController';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import { OperationIds } from '../../shared/Constants';
import IDataOperation from '../../shared/domain/IDataOperation';

export default class DataOperationChainControllerSpy
  implements IDataOperationChainController
{
  public spystore: any[];

  public operationSpy: IDataOperation | null = null;

  constructor(spystore: any[]) {
    this.spystore = spystore;
  }

  public connectOperationNodes(
    sourceId: string,
    targetId: string
  ): Promise<void> {
    this.spystore.push(sourceId, targetId, this.connectOperationNodes.name);
    return Promise.resolve();
  }

  public createOperationNode(
    type: OperationIds,
    id: string
  ): Promise<IDataOperation> {
    this.spystore.push(type, id, this.createOperationNode.name);
    if (this.operationSpy) return Promise.resolve(this.operationSpy);
    return Promise.resolve(new IsNullObject());
  }

  public getOperationByNodeId(id: string): Promise<IDataOperation> {
    this.spystore.push(id, this.getOperationByNodeId.name);
    if (this.operationSpy) return Promise.resolve(this.operationSpy);
    return Promise.resolve(new IsNullObject());
  }

  public removeNodeById(id: string): Promise<void> {
    this.spystore.push(id, this.removeNodeById.name);
    return Promise.resolve();
  }

  public setSpyForOperation(spy: IDataOperation): void {
    this.operationSpy = spy;
  }
}
