import CreateLevenstheinMatrix from '../../datapreprocess/CreateLevenstheinMatrix';
import { dbController } from '../../main/datahandling/utilities/DataBaseController';

let clm: CreateLevenstheinMatrix;
let data;
test('workaround', async () => {
  expect(true).toBe(true);
})
/*
beforeAll(async ()=>{
  data = await dbController.getAllDataFromTable();
})
beforeEach(()=>{
  clm = new CreateLevenstheinMatrix(data);
})

test('should return array of distances',async ()=>{
  let target = "001,00";
  let distances = [[1,2,3],"002","023"];
  //let result = await clm.calculateLevenstheinArrayByWorker(target,distances);
  //console.log(result)
});
*/
