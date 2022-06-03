export enum OperationIds {
  SORT_OPERATION = 'SORT_OPERATION',
  DATASOURCE = 'DATASOURCE',
  SLICE_DATA_OPERATION = 'SLICE_DATA_OPERATION',
  SELECT_FROM_DB = 'SELECT_FROM_DB',
  MAP_DISPLAY = 'MAP_DISPLAY',
  TIME_SLIDER = 'TIME_SLIDER',
  TIME_PLAYER = 'TIME_PLAYER',
  SELECT_BY_DAY = 'SELECT_BY_DAY',
  DBSCAN_CLUSTERING = 'DBSCAN_CLUSTERING',
}
const DATAOPEARATION_PREFIX = 'DATAOPEARATION_';

export enum Methods {
  DATA_OPERATION_GET_DATA,
  DATAOPERATION_GET_TYPE,
  DATA_OPERATION_SET_SETTINGS,
  DATA_OPERATION_TRIGGER_OPERATION,
  DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD,
  DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD,
  DATA_OPERATION_SET_SOURCE,
  DATA_OPERATION_GET_SOURCE,
  DATA_OPERATION_SET_TARGET,
  DATA_OPERATION_GET_TARGET,
  CHAIN_CONTROLLER_CREATE_OPERATION_NODE,
  CHAIN_CONTROLLER_GET_OPERATION_BY_NODE_ID,
  CHAIN_CONTROLLER_REMOVE_NODE_BY_ID,
  CHAIN_CONTROLLER_CONNECT_OPERATION_NODES,
  DATA_OPERATION_GET_SETTINGS,
  DATA_OPERATION_GET_META_DATA,
}

export enum TableNames {
  FRIDAY,
  SATURDAY,
  SUNDAY,
  TEST,
}

export const IPCEvents = {
  UPDATE: 'UPDATE_', UPDATE_BY_ID_AND_METHOD: 'UPDATE_BY_ID_AND_METHOD_',

}

export const RemoteUrls = {
  SELECTOR_NODE:"/selector-node-controller",
  DBSCAN_NODE: '/dbscan-node-controller',
}

export const PHONE_CONTROLLER_BASE_URL = 'http://settings-controller.local';

export const SelectorSettingsEvents = [
  'selector-node-setting:create',
  'selector-node-setting:delete',
  'selector-node-setting:update',
];

export class TableIndexing {
  static readonly FRIDAY_PersonId = "idx_parkmovementfri_PersonId";
  static readonly FRIDAY_Timestamp = "idx_parkmovementfri_timestamp";
  static readonly FRIDAY_PersonId_Timestamp = "idx_parkmovementfri_timestamp_PersonId";
  static readonly SATURDAY_PersonId = "idx_parkmovementsat_PersonId";
  static readonly SATURDAY_Timestamp = "idx_parkmovementsat_timestamp";
  static readonly SATURDAY_PersonId_Timestamp = "idx_parkmovementsat_PersonId_timestamp";
  static readonly SUNDAY_PersonId = "idx_parkmovementsun_PersonId";
  static readonly SUNDAY_Timestamp = "idx_parkmovementsun_timestamp";
  static readonly SUNDAY_PersonId_Timestamp = "idx_parkmovementsun_timestamp_PersonId";

}
export class SortBy {
  static readonly PersonId = "PersonId";
  static readonly Timestamp = "Timestamp";
}
