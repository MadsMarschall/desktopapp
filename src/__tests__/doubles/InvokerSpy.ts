import DataOperationInvoker from '../../main/datahandling/invokers/DataOperationInvoker';
import IDataOperationChainController from '../../shared/domain/IDataOperationController';
import { Methods } from '../../shared/Constants';
import IInvoker from '../../shared/domain/IInvoker';

export default class InvokerSpy implements IInvoker {
  public spyStorage: unknown[];

  constructor(spyStorage: unknown[]) {
    this.spyStorage = spyStorage;
  }

  handleRequest(id: string, method: Methods, ...args: any[]): Promise<any> {
    this.spyStorage.push(id);
    this.spyStorage.push(method);
    this.spyStorage.push(args);
    return Promise.resolve(true);
  }
}
