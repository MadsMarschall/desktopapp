import DataOperationProxy from '../../renderer/DataHandling/DataOperationProxy';

let dop: DataOperationProxy;
beforeEach(() => {
  dop = new DataOperationProxy('test');
});

test('can get id', () => {
  expect(dop.getId()).toBe('test');
});
