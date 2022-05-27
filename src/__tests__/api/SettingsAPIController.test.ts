/* eslint-disable */
import { TableNames } from 'shared/Constants';
import SettingsAPIController from '../../renderer/Utilities/SettingsAPIController';

let sac: SettingsAPIController;

beforeEach(() => {
  sac = new SettingsAPIController();
});
/*
test('canPostSelectorNodeSettings', async () => {
  expect(
    await sac.createSelectorSettings('someTest2', 1234, TableNames.SATURDAY)
  ).toBeGreaterThan(-1);
});

test('canDeleteSelectorNodeSetting', async () => {
  const id = await sac.createSelectorSettings(
    'yetAnotherNode',
    1234,
    TableNames.SATURDAY
  );
  const responseNumber = await sac.deleteSelectorNodeSetting(id);
  expect(responseNumber).toEqual(id);
  expect(responseNumber).toBeGreaterThan(-1);
});

test('canMocifyExistingSelectorNodeSetting', async () => {
  expect(
    await sac.modifySelectorNodeSetting(
      21,
      'modyfyingnodeid',
      123,
      TableNames.SATURDAY
    )
  ).toEqual(21);
});

test('canGetSelectorNodeSettingsById', async () => {
  expect((await sac.getSelectorNodeSetting(21)).id).toEqual(21);
});
*/
