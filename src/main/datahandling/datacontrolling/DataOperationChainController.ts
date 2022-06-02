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
import DataOperationLoggerDecorator from './decorators/DataOperationLoggerDecorator';
import SelectByDayOperation from './dataoperations/SelectByDayOperation';

export default class DataOperationChainController
  implements IDataOperationChainController
{
  private dataOperations: Map<string, IDataOperation>;

  constructor() {
    this.dataOperations = new Map<string, IDataOperation>();
  }

  async connectOperationNodes(sourceId: string, targetId: string): Promise<void> {
    const source = await this.getOperationByNodeId(sourceId)
    const target = await this.getOperationByNodeId(targetId)
    return await source.setTarget(target);
  }

  createOperationNode(type: OperationIds, id: string): Promise<IDataOperation> {
    let operation: IDataOperation;
    switch (type) {
      case OperationIds.SORT_OPERATION:
        operation = new SortDataOperation(new IsNullObject(),id);
        break;
      case OperationIds.SLICE_DATA_OPERATION:
        operation = new SliceDataOperation(new IsNullObject(),id);
        break;
      case OperationIds.SELECT_FROM_DB:
        operation = new SelectFromDBOperation(new IsNullObject(),id);
        break;
      case OperationIds.MAP_DISPLAY:
        operation = new MapDisplayOperation(new IsNullObject(),id);
        break;
      case OperationIds.TIME_SLIDER:
        operation = new TimeSliderOperation(new IsNullObject(),id);
        break;
      case OperationIds.TIME_PLAYER:
        operation = new TimePlayerOperation(new IsNullObject(),id);
        break;
      case OperationIds.SELECT_BY_DAY:
        operation = new SelectByDayOperation(new IsNullObject(),id);
        break;
      default:
        operation = new IsNullObject();
    }
    const loggedOperation = new DataOperationLoggerDecorator(operation);
    this.dataOperations.set(id, loggedOperation);
    return Promise.resolve(loggedOperation);
  }

  getOperationByNodeId(id: string): Promise<IDataOperation> {
    const operation = this.dataOperations.get(id);
    if (!operation) {
      return Promise.resolve(new IsNullObject());
    }
    return Promise.resolve(operation);
  }

  removeNodeById(id: string): Promise<void> {
    this.dataOperations.delete(id);
    return Promise.resolve();
  }

  getAllOperationNodes(): IDataOperation[] {
    return Array.from(this.dataOperations.values());
  }
}
