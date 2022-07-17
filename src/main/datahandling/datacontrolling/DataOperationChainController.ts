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
import DBScan from './dataoperations/dbscan/DBScan';
import DBScanOperation from './dataoperations/DBScanOperation';
import TimeFilteringOperation from './dataoperations/TimeFilteringOperation';
import DataOperationErrorLogger from '../../../shared/datatools/DataOperationErrorLogger';
import ClusterMapDisplayOperation from './dataoperations/ClusterMapDisplayOperation';
import SelectByTimeAndDay from './dataoperations/SelectByTimeOperation';
import SelectByTimeOperation from './dataoperations/SelectByTimeOperation';
import CreateGroupsFromMatrixOperation from './dataoperations/CreateGroupsFromMatrixOperation';
import DisplayGroupRideStatisticsOperation from './dataoperations/DisplayGroupRideStatisticsOperation';

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
        operation = new IsNullObject();
        break;
      case OperationIds.TIME_PLAYER:
        operation = new TimePlayerOperation(new IsNullObject(),id);
        break;
      case OperationIds.SELECT_BY_DAY:
        operation = new SelectByDayOperation(new IsNullObject(),id);
        break;
      case OperationIds.DBSCAN_CLUSTERING:
        operation = new DBScanOperation(new IsNullObject(),id);
        break;
      case OperationIds.TIME_FILTERING_OPERATION:
        operation = new TimeFilteringOperation(new IsNullObject(),id);
        break;
      case OperationIds.CLUSTER_MAP_DISPLAY:
        operation = new ClusterMapDisplayOperation(new IsNullObject(),id);
        break;
      case OperationIds.SELECT_BY_TIME_AND_DAY:
        operation = new SelectByTimeOperation(new IsNullObject(),id);
        break;
      case OperationIds.GROUPS_FROM_MATRIX:
        operation = new CreateGroupsFromMatrixOperation(new IsNullObject(),id);
        break;
      case OperationIds.DISPLAY_GROUP_RIDE_STATISTICS:
        operation = new DisplayGroupRideStatisticsOperation(new IsNullObject(),id);
        break;
      default:
        operation = new IsNullObject();
    }
    const loggedOperation = new DataOperationLoggerDecorator(operation);
    const errorHandler = new DataOperationErrorLogger(loggedOperation);
    this.dataOperations.set(id, errorHandler);
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
