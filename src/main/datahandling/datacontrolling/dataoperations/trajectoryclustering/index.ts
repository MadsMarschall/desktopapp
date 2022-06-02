import Cluster from "./boliu/Cluster";
import ClusterGen, { Parameter } from "./boliu/ClusterGen";
import Trajectory from "./boliu/Trajectory";
import CMDPoint from "./boliu/CMDPoint";
import { TraClusterDoc } from './boliu/TraClusterDoc';

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
tcd.loadData();

let p: Parameter = tcd.onEstimateParameter();

tcd.onClusterGenerate(20, 100);

if (p != null) {
	console.log("Based on the algorithm, the suggested parameters are:\n" + "eps:" + p.epsParam + "  minLns:" + p.minLnsParam);
}
//tcd.onClusterGenerate(args[1], p.epsParam, p.minLnsParam);
