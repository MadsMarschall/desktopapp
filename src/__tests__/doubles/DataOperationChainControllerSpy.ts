import IDataOperationChainController from '../../shared/domain/IDataOperationController';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';
import { OperationIds } from '../../shared/Constants';

export default class DataOperationChainControllerSpy
  implements IDataOperationChainController
{
  public spystore: any[];

  constructor(spystore: any[]) {
    this.spystore = spystore;
  }

  public connectOperationNodes(sourceId: string, targetId: string): void {
    this.spystore.push(sourceId, targetId, this.connectOperationNodes.name);
  }

  public createOperationNode(type: OperationIds, id: string) {
    this.spystore.push(type, id, this.createOperationNode.name);
    return new IsNullObject();
  }

  public getOperationByNodeId(id: string) {
    this.spystore.push(id, this.getOperationByNodeId.name);
    return new IsNullObject();
  }

  public removeNodeById(id: string): void {
    this.spystore.push(id, this.removeNodeById.name);
  }
}
