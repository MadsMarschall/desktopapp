import SQLiteDatabaseControllerStrategy from '../../utilities/DBStrategies/SQLiteDatabaseControllerStrategy';
import jDBSCAN from './dbscan/DBScan';
let sqlite = new SQLiteDatabaseControllerStrategy();

sqlite.getAllCheckins().then(async (data) => {
  const result = await new Promise((resolve) => {
    const result = jDBSCAN()
      .eps(5)
      .minPts(2)
      .distance('EUCLIDEAN')
      .data(data);
    resolve(result);
  }).then((result) => {

    //@ts-ignore
    result();

    // @ts-ignore
    console.log(result.getClusters());
  })



})
