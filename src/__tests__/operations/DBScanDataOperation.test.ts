
import TrajectoryClustering from '../../main/datahandling/datacontrolling/dataoperations/TrajectoryClustering';
import DataOperationSpy from '../doubles/DataOperationSpy';
import IDataOperation from '../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../shared/domain/Interfaces';
import data from "../doubles/DataStub";
import DBScanOperation from '../../main/datahandling/datacontrolling/dataoperations/DBScanOperation';
import { dbController } from '../../main/datahandling/utilities/DataBaseController';

let dbScanDataOperation: IDataOperation;
let spyOperation: DataOperationSpy;
let spyStorage: unknown[] = [];
let testId: string;
jest.setTimeout(180000);

let moveData:IDataPointMovement[] = data.map((dataPoint) => {
  return {
    ...dataPoint,
    timestamp: new Date(dataPoint.timestamp),
    id: "testId",
    affectedRows: 1
  } as IDataPointMovement;
})

beforeEach(() => {
    testId = 'testId';
    spyOperation = new DataOperationSpy(spyStorage);
    dbScanDataOperation = new DBScanOperation(spyOperation, testId);
});
test('test', () => {
    expect(true).toBe(true);
});

test('can cluster IDataMovementPoints data', async ()=>{

    spyOperation.setData(moveData);
    await dbScanDataOperation.triggerOperation()
  await dbScanDataOperation.getData().then((data) => {

  })
})
test('can cluster whole dataset', async ()=>{
  const data = await dbController.getAllDataFromTable()
    spyOperation.setData(data);
    await dbScanDataOperation.triggerOperation()
  await dbScanDataOperation.getData().then((data) => {
      dbScanDataOperation.getDisplayableData().then((displayableData) => {
        console.log(displayableData);
      })
  })
})
