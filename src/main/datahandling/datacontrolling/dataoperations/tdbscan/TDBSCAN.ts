import haversine from 'haversine-distance';
type Cordinate = [number,[number,number]];

export default class TDBSCAN {
  private list_coordinates:Cordinate[];
  private min_points: number;
  private eps: number;
  private ceps:number;
  private stop_min_points:number;
  private stop_eps:number;
  private stop_ceps:number;
  private move_ability:number;
  constructor(list_coordinates:Cordinate[], min_points:number, eps:number, ceps:number,stop_min_points:number,stop_eps:number,stop_ceps:number,move_ability:number) {
    this.list_coordinates = list_coordinates;
    this.min_points = min_points;
    this.eps = eps;
    this.ceps = ceps;
    this.stop_min_points = stop_min_points;
    this.stop_eps = stop_eps;
    this.stop_ceps = stop_ceps;
    this.move_ability = move_ability;
  }

  expandCluster(result_neighbors, cluster_id, label, eps, ceps, min_index_offset, innwe_list_cordinates) {
    let count = 0;
    while (count < result_neighbors.length) {
      let point = result_neighbors[count];
      let index = point[0];
      if (label[index] == -1) {
        label[index] = cluster_id;
      } else if (label[index] == 0) {
        label[index] = cluster_id;
        let expanding_cluster = this.get_neighbors(result_neighbors[count], eps, ceps, innwe_list_cordinates, min_index_offset);
        if (expanding_cluster.length >= this.min_points) {
          result_neighbors = result_neighbors.concat(expanding_cluster);
        }
      }
      count++;
    }
  }

  get_neighbors(each, eps, ceps, list_coordinates, min_index_offset): any[] {
    //let eps_km = eps / 1000;
    //let ceps_km = ceps / 1000;
    let index = each;
    let coordinates = each;
    let result = [each];
    let i = index - min_index_offset + 1;
    while (i < list_coordinates.length) {
      coordinates = list_coordinates[i][1];
      if (haversine(coordinates, coordinates) <= eps) {
        result.push(list_coordinates[i]);
      } else if (haversine(coordinates, coordinates) <= ceps) {
        break;
      }
      i++;
    }
    return result;
  }

  traj_direct_dist(cluster): number {
    return haversine(cluster[0], cluster[-1]);
  }

  traj_curve_dist(cluster): number {
    let total_dist = 0;
    for (let i = 0; i < cluster.length - 1; i++) {
      if (i < cluster.length - 1) {
        total_dist += haversine(cluster[i], cluster[i + 1]);
      }
    }
    return total_dist;
  }

  moveability(cluster) {
    if (this.traj_curve_dist(cluster) == 0) {
      return 0;
    }
    return this.traj_direct_dist(cluster) / this.traj_curve_dist(cluster);
  }

  find_key_with_the_highest_count(dict_cluster: Array<any[]>) {
    let highest_count = 0;
    dict_cluster.forEach(function(value, key) {
      if (value.length > highest_count) {
        highest_count = value.length;
      }
    });
    return highest_count;
  }

  main_run(inner_list_coordinates, eps, ceps, min_points) {
    let label: number[] = [];
    for (let i = 0; i < this.list_coordinates.length + 1; i++) {
      label.push(0);
    }
    let cluster_id = 1;
    let min_index_offset = inner_list_coordinates[0][0];

    inner_list_coordinates.forEach((each) => {
      let index = each[0];
      let result_neighbors = this.get_neighbors(each, eps, ceps, inner_list_coordinates, min_index_offset);
      if (label[index] == 0) {
        if (result_neighbors.length >= min_points) {
          label[index] = cluster_id;
          this.expandCluster(result_neighbors, cluster_id, label, eps, ceps, min_index_offset, inner_list_coordinates);
          cluster_id++;
        } else {
          label[index] = -1;
        }
      } else {
        label[index] = -1;
      }
    });
    let dict_cluster = {};

    for (cluster_id = 1; cluster_id < (label.slice(1,Math.max(...label))).length ; cluster_id++) {
      dict_cluster[cluster_id] = [];
      label.forEach((value, index) => {
        if (value == cluster_id) {
          dict_cluster[cluster_id].push(index - 1);
        }
      });
    }
    return dict_cluster;
  }

  run() {
    let dict_cluster: any[] = <any[]>this.main_run(this.list_coordinates, this.eps, this.ceps, this.min_points);
    let key_exceed: number[] = [];
    let move_dict_cluster = {};
    let main_label: number[] = [];
    this.list_coordinates.forEach((each) => {
      main_label.push(0);
    });

    Object.values(dict_cluster).forEach((value, key) => {
      let cordinates: any[] = [];
      let tuple_array: any[] = [];
      value.forEach((each) => {
        cordinates.push(this.list_coordinates[each][1]);
        tuple_array.push(this.list_coordinates[each]);
      });
      if (this.moveability(cordinates) > this.move_ability) {
        key_exceed.push(key);
      } else {
        move_dict_cluster[key] = tuple_array;
      }
    });
    Object.values(move_dict_cluster).forEach((value, key) => {
      dict_cluster = <any[]>this.main_run(value, this.stop_eps, this.stop_ceps, this.stop_min_points);
      if(Object.keys(dict_cluster).length > 0) {
        main_label = main_label.concat(dict_cluster[Object.keys(dict_cluster)[0]]);
      }
    })
    return main_label;

  }


}

let TEST_COORDINATES:Cordinate[] = [[1, [1.348378, 103.737931]],
  [2, [1.348378, 103.737931]], [3, [1.348378, 10.737931]],[4, [1.348378, 10.737931]]]
let tdbscan = new TDBSCAN(TEST_COORDINATES, 2, 50, 150, 2, 10, 30, 0.95)
console.log(tdbscan.run())


