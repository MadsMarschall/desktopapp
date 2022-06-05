import DataBaseController from '../../main/datahandling/utilities/MySQLDatabaseControllerStrategy';
import { TableNames } from '../../shared/Constants';

let dataBaseController: DataBaseController;

beforeEach(() => {
    dataBaseController = new DataBaseController();
});
jest.setTimeout(90000)

test("workaround",()=>{
    expect(true).toBe(true);
})

test("can get by time interval", async () => {
  const resut = await dataBaseController.getDataByTimeInterval(new Date("2014-06-06 18:09:34"),new Date("2014-06-06 18:14:04"),TableNames.FRIDAY);
  expect(resut.length).toBeGreaterThan(4);
})

/*
test('should be able to getSorted', async () => {

  const result = await dataBaseController.getAllDataFromTable(TableNames.SATURDAY,"PersonId")
    for (let i = 1; i < 100; i++) {
        expect(result[i].PersonId).toBeGreaterThanOrEqual(i-1);
    }
});

 */
test('should get data by PersonId: sat', async () => {
    const result = await dataBaseController.getDataByPersonId(TableNames.SATURDAY, 340699);
    expect(result[0].PersonId).toBe(340699);
});
test('should get data by PersonId: sun', async () => {
  const result = await dataBaseController.getDataByPersonId(TableNames.SUNDAY, 340699);
  expect(result[0].PersonId).toBe(340699);
});


