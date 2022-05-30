import IDataOperationProxy from '../../shared/domain/IDataOperationProxy';
import { IDataPointMovement } from '../../shared/domain/Interfaces';
import IDataOperation from '../../shared/domain/IDataOperation';
import IsNullObject from '../../main/datahandling/datacontrolling/dataoperations/IsNullObject';

export default class DataOperationErrorLogger implements IDataOperationProxy {
  private readonly dataOperationProxy: IDataOperationProxy;

  constructor(dataOperationProxy: IDataOperationProxy) {
    this.dataOperationProxy = dataOperationProxy;
  }

  getData(): Promise<IDataPointMovement[]> {
    return this.dataOperationProxy.getData().then(
      (data: IDataPointMovement[]) => {
        return data;
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve([]);
      }
    );
  }

  getId(): string {
    try {
      return this.dataOperationProxy.getId();
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  getSource(): Promise<IDataOperation> {
    return this.dataOperationProxy.getSource().then(
      (data: IDataOperation) => {
        return data;
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve(new IsNullObject());
      }
    );
  }

  getTarget(): Promise<IDataOperation> {
    return this.dataOperationProxy.getTarget().then(
      (data: IDataOperation) => {
        return data;
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve(new IsNullObject());
      }
    );
  }

  getType(): Promise<string> {
    return this.dataOperationProxy.getType().then(
      (data: string) => {
        return data;
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve('');
      }
    );
  }

  retriggerOperationChainBackward(): Promise<void> {
    return this.dataOperationProxy.retriggerOperationChainBackward().then(
      () => {
        return Promise.resolve();
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve();
      }
    );
  }

  retriggerOperationChainForward(): Promise<void> {
    return this.dataOperationProxy.retriggerOperationChainForward().then(
      () => {
        return Promise.resolve();
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve();
      }
    );
  }

  setSettings(settings: any[]): Promise<boolean> {
    return this.dataOperationProxy.setSettings(settings).then(
      (data: boolean) => {
        return data;
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve(false);
      }
    );
  }

  setSource(source: IDataOperation): Promise<void> {
    return this.dataOperationProxy.setSource(source).then(
      () => {
        return Promise.resolve();
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve();
      }
    );
  }

  setTarget(target: IDataOperation): Promise<void> {
    return this.dataOperationProxy.setTarget(target).then(
      () => {
        return Promise.resolve();
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve();
      }
    );
  }

  triggerOperation(): Promise<void> {
    return this.dataOperationProxy.triggerOperation().then(
      () => {
        return Promise.resolve();
      },
      (error: Error) => {
        console.error(error);
        return Promise.resolve();
      }
    );
  }
}
