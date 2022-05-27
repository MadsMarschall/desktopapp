"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbController = void 0;
var DatabaseControllerProxy = /** @class */ (function () {
    function DatabaseControllerProxy() {
    }
    DatabaseControllerProxy.prototype.getAllDataFromTable = function (SQLTableName) {
        return window.DataBaseController.getAllDataFromTable(SQLTableName);
    };
    DatabaseControllerProxy.prototype.getDataByPersonId = function (SQLTableName, PersonId) {
        return window.DataBaseController.getDataByPersonId(SQLTableName, PersonId);
    };
    DatabaseControllerProxy.prototype.insertInDatabase = function (object, SQLTableName) {
        return window.DataBaseController.insertInDatabase(object, SQLTableName);
    };
    DatabaseControllerProxy.prototype.loadDataIntoDatabase = function (pathToCSV, SQLTableName) {
        return window.DataBaseController.loadDataIntoDatabase(pathToCSV, SQLTableName);
    };
    return DatabaseControllerProxy;
}());
exports.default = DatabaseControllerProxy;
exports.dbController = new DatabaseControllerProxy();
