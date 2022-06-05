import Trajectory from './Trajectory';
import Cluster from './Cluster';
import CMDPoint from './CMDPoint';
import ClusterGen, { Parameter } from './ClusterGen';
import DataBaseController from '../../../../utilities/DBStrategies/MySQLDatabaseControllerStrategy';
import { SortBy, TableIndexing, TableNames } from '../../../../../../shared/Constants';
import { promises } from 'dns';
import simplify from 'simplify-js';
import { IDataPointMovement } from '../../../../../../shared/domain/Interfaces';
import SimplifyTrajectory from './SimplifyTrajectory';
import ICMDPoint from './ICMDPoint';

export class TraClusterDoc {
  m_nDimensions: number;
  m_nTrajectories: number;
  m_nClusters: number;
  m_clusterRatio: number;
  m_maxNPoints: number;
  m_trajectoryList: Trajectory[];
  m_clusterList: Cluster[];

  public constructor() {
    this.m_nDimensions = 2;
    this.m_nTrajectories = 0;
    this.m_nClusters = 0;
    this.m_clusterRatio = 0.0;
    this.m_maxNPoints = 0;
    this.m_trajectoryList = new Array<Trajectory>();
    this.m_clusterList = new Array<Cluster>();
  }

  onOpenDocument(inputFileName: number): boolean {
    return true;
  }

  loadDataFromDB(): Promise<IDataPointMovement[]> {
    let db = new DataBaseController();
    return db.getAllDataFromTable(TableNames.FRIDAY, [SortBy.PersonId,SortBy.Timestamp], TableIndexing.FRIDAY_PersonId_Timestamp, 'LIMIT 50000');
  }

  public divideDataIntoTrajectories(dataPoints: IDataPointMovement[]): Promise<Array<CMDPoint[]>> {
    let lastDateTime = new Date(0);
    return new Promise((async (resolve, reject) => {
      let formatedTrajectoriesList: Array<CMDPoint[]> = new Array<CMDPoint[]>();

      let currentTrajectory: CMDPoint[] = new Array<CMDPoint>();

      let lastPersonId: number | null = null;
      await dataPoints.forEach((dataPoint, index) => {
        let firstTimeRunning: boolean = lastPersonId == null;
        let isSamePerson: boolean = dataPoints[index-1]?.PersonId == dataPoint.PersonId;
        if (!isSamePerson && !firstTimeRunning) {
          formatedTrajectoriesList.push(currentTrajectory);
          currentTrajectory = new Array<CMDPoint>();

          //reset watch on lastDateTime to current dataPoint
          lastDateTime = dataPoint.timestamp;
        }
        let newCMDPoint = new CMDPoint(2, dataPoint);
        newCMDPoint.setM_coordinate(0, dataPoint.X);
        newCMDPoint.setM_coordinate(1, dataPoint.Y);
        currentTrajectory.push(newCMDPoint);

        if (lastDateTime > dataPoint.timestamp) {
          reject(new Error('Data is not sorted by timestamp \n'+ "Reached index: "+ index +"\n" + "Current datapoint: "+JSON.stringify(dataPoint)+ '\n' + "Last datapoint: " +JSON.stringify(dataPoints[index-1]) + "\n" + lastDateTime.toString()));
        }

        lastPersonId = dataPoint.PersonId;
        lastDateTime = dataPoint.timestamp;
        if(!lastPersonId) throw new Error('PersonId is null');
      });
      resolve(formatedTrajectoriesList);
    }));
  }

  public simplifyTrajectories(unformattedTrajectoriesList: Array<IDataPointMovement[]>): Promise<Array<CMDPoint[]>> {
    const simplify = new SimplifyTrajectory();
    return new Promise((async (resolve, reject) => {
      let simplifiedTrajectoriesList: Array<CMDPoint[]> = new Array<CMDPoint[]>();
      await unformattedTrajectoriesList.forEach((trajectory, index) => {
        let simplifiedTrajectory = simplify.simplify(trajectory,2) as CMDPoint[];
        simplifiedTrajectoriesList.push(simplifiedTrajectory);
      });
      resolve(simplifiedTrajectoriesList);
    }));
  }

  public addTrajectionsToTraculus(trajectories: Array<IDataPointMovement[]>): Promise<void> {
    let lastPersonId = 0;
    let currentTrajectory: Trajectory | null = null;
    return new Promise(async (resolve) => {
      trajectories.forEach((trajectory, index) => {
        let formattedTrajectory = new Trajectory(index,2)
        formattedTrajectory.setM_pointArray(<CMDPoint[]>trajectory);
        formattedTrajectory.setM_nPoints(trajectory.length);
        this.m_trajectoryList.push(formattedTrajectory);
      });
      console.log(this.m_trajectoryList[0].getM_pointArray().map((point) => point.m_coordinate.toString()));
      resolve();
    });
  }

  onClusterGenerate(epsParam: number, minLnsParam: number): boolean {
    let generator: ClusterGen = new ClusterGen(this);

    if (this.m_nTrajectories == 0) {
      console.log('Load a trajectory data set first');
    }
    console.log('Cluster generation started');

    // FIRST STEP: Trajectory Partitioning
    if (!generator.partitionTrajectory()) {
      console.log('Unable to partition a trajectory\n');
      return false;
    }
    console.log('Trajectory partitioning completed\n');

    // SECOND STEP: Density-based Clustering
    if (!generator.performDBSCAN(epsParam, minLnsParam)) {
      console.log('Unable to perform the DBSCAN algorithm\n');
      return false;
    }
    console.log('DBSCAN algorithm completed\n');

    // THIRD STEP: Cluster Construction
    if (!generator.constructCluster()) {
      console.log('Unable to construct a cluster\n');
      return false;
    }
    console.log('Cluster construction completed\n');


    for (let i = 0; i < this.m_clusterList.length; i++) {
      //this.m_clusterList.
      console.log(this.m_clusterList[i].getM_clusterId());
      for (let j = 0; j < this.m_clusterList[i].getM_PointArray().length; j++) {

        let x = this.m_clusterList[i].getM_PointArray()[j].getM_coordinate(0);
        let y = this.m_clusterList[i].getM_PointArray()[j].getM_coordinate(1);
        console.log('   ' + x + ' ' + y + '   ');
      }
      console.log();
    }
    return true;
  }

  onEstimateParameter(): Parameter {
    let p = new Parameter();
    let generator = new ClusterGen(this);
    if (!generator.partitionTrajectory()) {
      console.log('Unable to partition a trajectory\n');
      throw new Error('Unable to partition a trajectory\n');
    }
    if (!generator.estimateParameterValue(p)) {
      console.log('Unable to calculate the entropy\n');
      throw new Error('Unable to calculate the entropy\n');
    }
    return p;
  }

}
