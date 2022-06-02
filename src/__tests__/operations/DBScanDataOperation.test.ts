
import TrajectoryClustering from '../../main/datahandling/datacontrolling/dataoperations/TrajectoryClustering';
import DataOperationSpy from '../doubles/DataOperationSpy';
import IDataOperation from '../../shared/domain/IDataOperation';

let dbScanDataOperation: TrajectoryClustering;
let spyOperation: DataOperationSpy;
let spyStorage: unknown[] = [];
let testId: string;
beforeEach(() => {
    testId = 'testId';
    spyOperation = new DataOperationSpy(spyStorage);
    dbScanDataOperation = new TrajectoryClustering(spyOperation, testId);
});
test('test', () => {
    expect(true).toBe(true);
});

