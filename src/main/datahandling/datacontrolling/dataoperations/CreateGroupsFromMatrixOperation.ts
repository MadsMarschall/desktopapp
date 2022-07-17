import IsNullObject from './IsNullObject';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement, IDistanceMatrixPoint } from '../../../../shared/domain/Interfaces';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';
import { dbController } from '../../utilities/DataBaseController';
import { BrowserWindow } from 'electron';
import { IPCEvents } from '../../../../shared/Constants';

export default class CreateGroupsFromMatrixOperation implements IDataOperation {
  private inputOperation: IDataOperation;

  private targetOperation: IDataOperation;
  private readonly id: string;
  private outputData: IDataPointMovement[] = [];
  private settings: unknown[] = [];
  private groups: any[] = [];

  constructor(inputOperation: IDataOperation, id: string) {
    this.id = id;
    this.inputOperation = inputOperation;
    this.targetOperation = new IsNullObject();
  }

  getTarget(): Promise<IDataOperation> {
    return Promise.resolve(this.targetOperation);
  }

  setTarget(target: IDataOperation): Promise<void> {
    this.targetOperation = target;
    return Promise.resolve();
  }

  async getData(): Promise<IDataPointMovement[]> {
    return this.inputOperation.getData();
  }

  getSource(): Promise<IDataOperation> {
    return Promise.resolve(this.inputOperation);
  }

  getType(): Promise<string> {
    return Promise.resolve(CreateGroupsFromMatrixOperation.name);
  }

  retriggerOperationChainBackward(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.inputOperation.retriggerOperationChainBackward();
      await this.inputOperation.triggerOperation();
      resolve();
    });
  }

  retriggerOperationChainForward(): Promise<void> {
    return new Promise(async (resolve) => {
      await this.triggerOperation();
      await this.targetOperation.retriggerOperationChainForward();
      resolve();
    });
  }

  async setSettings(settings: any[]): Promise<boolean> {
    this.settings = settings;
    await this.targetOperation.triggerOperation();
    if (BrowserWindow && BrowserWindow.getAllWindows().length > 0) {
      BrowserWindow.getAllWindows()[0]!.webContents.send(IPCEvents.UPDATE);
    }
    else {
      throw new Error('Window not found');
    }
    return true;
  }

  setSource(source: IDataOperation): Promise<void> {
    console.log(
      source.getType(),
      ' is connected to:',
      CreateGroupsFromMatrixOperation.name
    );
    this.inputOperation = source;
    return Promise.resolve();
  }

  async triggerOperation(): Promise<void> {
    this.outputData = [];
    const distanceMatrix: IDistanceMatrixPoint[] = await this.loadDataFromDB();
    this.groups = await this.createGroups(distanceMatrix);
  }

  getId(): Promise<string> {
    return Promise.resolve(this.id);
  }

  async getSettings(): Promise<any[]> {
    return this.settings;
  }

  async getDisplayableData(): Promise<IDisplayableData> {
    const result: IDisplayableData = {
      entries: this.outputData.length,
      id: this.id,
      name: await this.getType(),
      sourceOperationId: await this.inputOperation.getId(),
      targetOperationId: await this.targetOperation.getId(),
      settings: this.settings,
      groups: this.groups
    };
    return Promise.resolve(result);
  }

  public async loadDataFromDB(): Promise<IDistanceMatrixPoint[]> {
    if (typeof this.settings[0] !== 'number') Promise.reject('Settings wrong formatted - Not a number');
    return dbController.getMatrixByThreshold(<number>this.settings[0]);
  }

  public async createGroups(distanceMatrix: IDistanceMatrixPoint[]): Promise<unknown[]> {
    const groups: any[] = [];
    let currentGroup: number[] = [];
    let currentPerson: number = 0;
    let groupCounter: number = 0;
    await distanceMatrix.forEach((point, index) => {
      if (point.Person_1 != currentPerson) {
        if (groups.length > 0) {
          groups[groups.length - 1].numberOfMembers = currentGroup.length.valueOf();
          groups[groups.length - 1].members = currentGroup.join(',');
        }
        currentGroup = [];
        groupCounter++;
        groups.push({ members: '', groupId: groupCounter, numberOfMembers: -1 });
        currentPerson = point.Person_1;
      }
      currentGroup.push(point.Person_2);
    });
    return groups;
  }

}
