import CharQueryOperation from '../../main/datahandling/datacontrolling/dataoperations/CharQueryOperation';
import DataOperationSpy from '../doubles/DataOperationSpy';
import { IDataPointMovement } from '../../shared/domain/Interfaces';
import data from '../doubles/DataStub';


let cqo:CharQueryOperation;
let spyOperation: DataOperationSpy
let moveData:IDataPointMovement[] = data.map((dataPoint) => {
  return {
    ...dataPoint,
    timestamp: new Date(dataPoint.timestamp),
    id: "testId",
    affectedRows: 1
  } as IDataPointMovement;
})
let spyStore: unknown[];

beforeEach(() => {
  spyStore = [];
  spyOperation = new DataOperationSpy(spyStore);
  cqo = new CharQueryOperation(spyOperation, "tester");
})

test('should retrive formatted values af triggerOperation', async () => {
  spyOperation.setData(moveData);
  await cqo.setSettings(["PersonId", "X"])
  await cqo.triggerOperation()
  await cqo.getData().then((data)=>{
    console.log(data)
  })

})
