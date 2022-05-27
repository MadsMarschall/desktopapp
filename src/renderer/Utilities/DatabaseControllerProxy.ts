import { TableNames } from '../../shared/Constants';
import {
  ICSVInputObject,
  IDataBaseController,
  IDataPointMovement,
} from '../../shared/domain/Interfaces';

export default class DatabaseControllerProxy implements IDataBaseController {
  public getAllDataFromTable(
    SQLTableName: TableNames
  ): Promise<IDataPointMovement[]> {
    return window.DataBaseController.getAllDataFromTable(SQLTableName);
  }

  public getDataByPersonId(
    SQLTableName: TableNames,
    PersonId: number
  ): Promise<IDataPointMovement[]> {
    return window.DataBaseController.getDataByPersonId(SQLTableName, PersonId);
  }

  public insertInDatabase(
    object: ICSVInputObject,
    SQLTableName: TableNames
  ): Promise<boolean> {
    return window.DataBaseController.insertInDatabase(object, SQLTableName);
  }

  public loadDataIntoDatabase(
    pathToCSV: string,
    SQLTableName: TableNames
  ): Promise<void> {
    return window.DataBaseController.loadDataIntoDatabase(
      pathToCSV,
      SQLTableName
    );
  }
}
export const dbController = new DatabaseControllerProxy();
