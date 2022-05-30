export enum OperationIds {
  SORT_OPERATION = 'SORT_OPERATION',
  DATASOURCE = 'DATASOURCE',
  SLICE_DATA_OPERATION = 'SLICE_DATA_OPERATION',
  SELECT_FROM_DB = 'SELECT_FROM_DB',
  MAP_DISPLAY = 'MAP_DISPLAY',
  TIME_SLIDER = 'TIME_SLIDER',
  TIME_PLAYER = 'TIME_PLAYER',
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
}

export enum TableNames {
  FRIDAY,
  SATURDAY,
  SUNDAY,
  TEST,
}

export const IPCEvents = {
  UPDATE: 'UPDATE_',
}

export const PHONE_CONTROLLER_BASE_URL = 'http://192.168.2.126:8080';

export const SelectorSettingsEvents = [
  'selector-node-setting:create',
  'selector-node-setting:delete',
  'selector-node-setting:update',
];
