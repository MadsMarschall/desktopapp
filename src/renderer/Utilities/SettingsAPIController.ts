import axios, { AxiosInstance } from 'axios';
import { TableNames } from '../../shared/Constants';

interface ISelectorNodeSetting {
  id: number;
  attributes: {
    PersonId: string;
    TableName: number;
    createdAt: string;
    updatedAt: string;
    NodeId: string;
  };
}

export default class SettingsAPIController {
  private api: AxiosInstance;

  constructor() {
    // const currentIP = window.myAPI.getNetworkInfo.Ethernet[0]
    const currentIP = '192.168.2.126';
    this.api = axios.create({
      baseURL: `http://${currentIP}:1337`,
      timeout: 2000,
    });
  }

  async createSelectorSettings(
    Nodeid: string,
    PersonId: number,
    SQLTableName: TableNames
  ): Promise<number> {
    const data = JSON.stringify({
      data: {
        PersonId,
        TableName: SQLTableName,
        NodeId: Nodeid,
      },
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let result = -1;
    await this.api
      .post('api/selector-node-settings', data, config)
      // eslint-disable-next-line promise/always-return
      .then((res) => {
        result = res.data.data.id;
      })
      .catch(function (error) {
        console.log(error.toJSON());
        result = -1;
      });

    return result;
  }

  async getSelectorNodeSetting(
    StrapiId: number
  ): Promise<ISelectorNodeSetting> {
    let result: ISelectorNodeSetting | undefined;
    await this.api
      .get(`api/selector-node-settings/${StrapiId}`)
      .then((res) => {
        result = res.data.data;
      })
      .catch(function (error) {
        console.log(error.toJSON());
      });
    if (result == undefined) throw new Error('no settings with that objectId');
    return result;
  }

  async deleteSelectorNodeSetting(StrapiId: number): Promise<number> {
    let result = -1;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    };

    await this.api
      .delete(`api/selector-node-settings/${StrapiId}`, config)
      .then((res) => {
        result = res.data.data.id;
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        result = -1;
      });
    return result;
  }

  async modifySelectorNodeSetting(
    StrapiId: number,
    Nodeid: string,
    PersonId: number,
    SQLTableName: TableNames
  ): Promise<number> {
    let result = -1;

    const data = JSON.stringify({
      data: {
        PersonId,
        TableName: SQLTableName,
        NodeId: Nodeid,
      },
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    };
    await this.api
      .put(`api/selector-node-settings/${StrapiId}`, data, config)
      .then((res) => {
        result = res.data.data.id;
      })
      .catch(function (error) {
        console.log(error.toJSON());
        result = -1;
      });

    return result;
  }

  public createMapSettings(id: string): Promise<number> {
    return new Promise<number>(() => {});
  }
}

export const settingsAPI = new SettingsAPIController();
