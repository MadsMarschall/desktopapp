import { Methods } from '../Constants';

export default interface IInvoker {
  handleRequest(id: string, method: Methods, ...args: any[]): Promise<any>;
}
