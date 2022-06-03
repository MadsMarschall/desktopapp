import ClusterGen, { Parameter } from "./boliu/ClusterGen";
import { TraClusterDoc } from './boliu/TraClusterDoc';
import dotenv from 'dotenv';

export function logCaller (){
	var callerName;
	try { throw new Error(); }
	catch (e) {
		console.log(e);}
};

function onEstimateParameter() {
	let p: Parameter = new Parameter();
	let generator: ClusterGen = new ClusterGen();
	if (!generator.partitionTrajectory()) {
		console.log("Unable to partition a trajectory\n");
		return null;
	}
	if (!generator.estimateParameterValue(p)) {
		console.log("Unable to calculate the entropy\n");
		return null;
	}
	return p;
}


let tcd = new TraClusterDoc();
tcd.loadDataFromDB().then((data)=>{
  tcd.divideDataIntoTrajectories(data).then((formattedTrajectories)=>{
    console.log("Trajectories: " + formattedTrajectories.length);
    console.log("Trajectory sample orginals: " + formattedTrajectories[0].length);
    formattedTrajectories.forEach((trajectory)=>{
     trajectory.forEach((point)=>{
       if(point.m_coordinate.length != 2) throw new Error("Invalid coordinate");
     });
    });
    tcd.simplifyTrajectories(formattedTrajectories).then((simplifiedTrajectories)=>{
      console.log("Trajectory sample after simplyfying: " + simplifiedTrajectories[0].length);
      tcd.addTrajectionsToTraculus(simplifiedTrajectories).then(()=>{
        console.log("Trajectory added");
        let p: Parameter = tcd.onEstimateParameter();
        console.log("found parameter: " + p.toString());
        tcd.onClusterGenerate(p.epsParam||20, p.minLnsParam || 100);
        console.log("Clustered");
      });
    });

  })

})

//tcd.onClusterGenerate(args[1], p.epsParam, p.minLnsParam);
