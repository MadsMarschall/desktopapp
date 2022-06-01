
import DBScanDataOperation from '../../main/datahandling/datacontrolling/dataoperations/DBScanDataOperation';
import DataOperationSpy from '../doubles/DataOperationSpy';
import IDataOperation from '../../shared/domain/IDataOperation';

let dbScanDataOperation: DBScanDataOperation;
let spyOperation: DataOperationSpy;
let spyStorage: unknown[] = [];
let testId: string;
beforeEach(() => {
    testId = 'testId';
    spyOperation = new DataOperationSpy(spyStorage);
    dbScanDataOperation = new DBScanDataOperation(spyOperation, testId);
});
test('test', () => {
    expect(true).toBe(true);
});

