import React, { Context } from 'react';
import IDataOperationChainController from '../../shared/domain/IDataOperationController';

// eslint-disable-next-line import/prefer-default-export
export const ChainControllerContext =
  React.createContext<IDataOperationChainController>(null as any);
