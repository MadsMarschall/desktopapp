import Trajectory from './Trajectory';
import Cluster from './Cluster';
import CMDPoint from './CMDPoint';
import ClusterGen, { Parameter } from './ClusterGen';

export class TraClusterDoc {
  m_nDimensions: number;
  m_nTrajectories: number;
  m_nClusters: number;
  m_clusterRatio: number;
  m_maxNPoints: number;
  m_trajectoryList: Trajectory[];
  m_clusterList: Cluster[];
  public constructor() {
    this.m_nDimensions = 0;
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
  loadData(){
    this.m_nTrajectories = 10;
    for (let j = 0; j < 100; j++){
      let result: Trajectory = new Trajectory(j,2);
      for (let i = 0; i < 100; i++){
        let dataPoint = new CMDPoint(2)
        dataPoint.m_coordinate[0] = Math.random()*10+i;
        dataPoint.m_coordinate[1] = Math.random()*10+i;
        result.addPointToArray(dataPoint);
        console.log(dataPoint)
      }
      this.m_trajectoryList.push(result);
    }
  }
  onClusterGenerate(epsParam: number, minLnsParam: number): boolean {
    let generator:ClusterGen = new ClusterGen(this);

    if(this.m_nTrajectories == 0) {
      console.log("Load a trajectory data set first");
    }

    // FIRST STEP: Trajectory Partitioning
    if (!generator.partitionTrajectory())
    {
      console.log("Unable to partition a trajectory\n");
      return false;
    }

    // SECOND STEP: Density-based Clustering
    if (!generator.performDBSCAN(epsParam, minLnsParam))
    {
      console.log("Unable to perform the DBSCAN algorithm\n");
      return false;
    }

    // THIRD STEP: Cluster Construction
    if (!generator.constructCluster())
    {
      console.log( "Unable to construct a cluster\n");
      return false;
    }


    for (let i = 0; i <this.m_clusterList.length; i++) {
      //this.m_clusterList.
      console.log(this.m_clusterList[i].getM_clusterId());
      for (let j = 0; j<this.m_clusterList[i].getM_PointArray().length; j++) {

        let x = this.m_clusterList[i].getM_PointArray()[j].getM_coordinate(0);
        let y = this.m_clusterList[i].getM_PointArray()[j].getM_coordinate(1);
        console.log("   "+ x +" "+ y +"   ");
      }
      console.log();
    }
    return true;
  }
  onEstimateParameter(): Parameter {
    let p = new Parameter();
    let generator = new ClusterGen(this);
    if (!generator.partitionTrajectory()) {
      console.log("Unable to partition a trajectory\n");
      throw new Error("Unable to partition a trajectory\n");
    }
    if (!generator.estimateParameterValue(p)) {
      console.log("Unable to calculate the entropy\n");
      throw new Error("Unable to calculate the entropy\n");
    }
    return p;
  }

}
