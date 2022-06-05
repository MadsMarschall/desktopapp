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
  TIME_FILTERING_OPERATION = 'TIME_FILTERING_OPERATION',
  CLUSTER_MAP_DISPLAY= 'CLUSTER_MAP_DISPLAY',
  SELECT_BY_TIME_AND_DAY = 'SELECT_BY_TIME_AND_DAY',
}
const DATAOPEARATION_PREFIX = 'DATAOPEARATION_';

export class Methods {
  static readonly DATA_OPERATION_GET_DATA= 'DATA_OPERATION_GET_DATA'
  static readonly DATAOPERATION_GET_TYPE = 'DATAOPERATION_GET_TYPE'
  static readonly DATA_OPERATION_SET_SETTINGS = 'DATA_OPERATION_SET_SETTINGS'
  static readonly DATA_OPERATION_TRIGGER_OPERATION = 'DATA_OPERATION_TRIGGER_OPERATION'
  static readonly DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD = 'DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD'
  static readonly DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD = 'DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_BACKWARD'
  static readonly DATA_OPERATION_SET_SOURCE = 'DATA_OPERATION_SET_SOURCE'
  static readonly DATA_OPERATION_GET_SOURCE = 'DATA_OPERATION_GET_SOURCE'
  static readonly DATA_OPERATION_SET_TARGET = 'DATA_OPERATION_SET_TARGET'
  static readonly DATA_OPERATION_GET_TARGET = 'DATA_OPERATION_GET_TARGET'
  static readonly CHAIN_CONTROLLER_CREATE_OPERATION_NODE = 'CHAIN_CONTROLLER_CREATE_OPERATION_NODE'
  static readonly CHAIN_CONTROLLER_GET_OPERATION_BY_NODE_ID = 'CHAIN_CONTROLLER_GET_OPERATION_BY_NODE_ID'
  static readonly CHAIN_CONTROLLER_REMOVE_NODE_BY_ID = 'CHAIN_CONTROLLER_REMOVE_NODE_BY_ID'
  static readonly CHAIN_CONTROLLER_CONNECT_OPERATION_NODES = 'CHAIN_CONTROLLER_CONNECT_OPERATION_NODES'
  static readonly DATA_OPERATION_GET_SETTINGS = 'DATA_OPERATION_GET_SETTINGS'
  static readonly DATA_OPERATION_GET_META_DATA = 'DATA_OPERATION_GET_META_DATA'
}

export enum TableNames {
  TEST= "testdata",
  FRIDAY = "parkmovementfri",
  SATURDAY = "parkmovementsat",
  SUNDAY = "parkmovementsun",
}

export const IPCEvents = {
  UPDATE: 'UPDATE_', UPDATE_BY_ID_AND_METHOD: 'UPDATE_BY_ID_AND_METHOD_',

}

export const RemoteUrls = {
  SELECTOR_NODE:"/selector-node-controller",
  DBSCAN_NODE: '/dbscan-node-controller', TIME_FILTERING: '/time-filtering-controller', SELECT_BY_DAY: '/select-by-day-controller', SELECT_BY_TIME_AND_DAY: '/select-by-time-and-day-controller',

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
