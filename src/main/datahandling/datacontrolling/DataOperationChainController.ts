import IDataOperationChainController from '../../../shared/domain/IDataOperationController';
import IsNullObject from './dataoperations/IsNullObject';
import TimePlayerOperation from './dataoperations/TimePlayerOperation';
import { OperationIds } from '../../../shared/Constants';
import MapDisplayOperation from './dataoperations/MapDisplayOperation';
import SliceDataOperation from './dataoperations/SliceDataOperation';
import SelectFromDBOperation from './dataoperations/SelectFromDBOperation';
import IDataOperation from '../../../shared/domain/IDataOperation';
import SortDataOperation from './dataoperations/SortDataOperation';
import TimeSliderOperation from './dataoperations/TimeSliderOperation';

export default class DataOperationChainController
  implements IDataOperationChainController
{
  private dataOperations: Map<string, IDataOperation>;

  constructor() {
    this.dataOperations = new Map<string, IDataOperation>();
  }

  connectOperationNodes(sourceId: string, targetId: string): void {
    this.getOperationByNodeId(sourceId).setTarget(
      this.getOperationByNodeId(targetId)
    );
  }

  createOperationNode(type: OperationIds, id: string): IDataOperation {
    let operation: IDataOperation;
    switch (type) {
      case OperationIds.SORT_OPERATION:
        operation = new SortDataOperation(new IsNullObject());
        break;
      case OperationIds.SLICE_DATA_OPERATION:
        operation = new SliceDataOperation(new IsNullObject());
        break;
      case OperationIds.SELECT_FROM_DB:
        operation = new SelectFromDBOperation(new IsNullObject());
        break;
      case OperationIds.MAP_DISPLAY:
        operation = new MapDisplayOperation(new IsNullObject());
        break;
      case OperationIds.TIME_SLIDER:
        operation = new TimeSliderOperation(new IsNullObject());
        break;
      case OperationIds.TIME_PLAYER:
        operation = new TimePlayerOperation(new IsNullObject());
        break;
      default:
        operation = new IsNullObject();
    }
    this.dataOperations.set(id, operation);
    return operation;
  }

  getOperationByNodeId(id: string): IDataOperation {
    const operation = this.dataOperations.get(id);
    if (!operation) {
      return new IsNullObject();
    }
    return operation;
  }

  removeNodeById(id: string) {
    this.dataOperations.delete(id);
  }

  getAllOperationNodes(): IDataOperation[] {
    return Array.from(this.dataOperations.values());
  }
}
