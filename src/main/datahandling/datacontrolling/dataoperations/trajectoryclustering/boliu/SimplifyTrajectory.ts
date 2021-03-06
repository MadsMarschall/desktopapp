/*
 (c) 2017, Vladimir Agafonkin
 SimplifyTrajectory.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// to suit your point format, run search/replace for '.X' and '.Y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)
import { IDataPointMovement } from '../../../../../../shared/domain/Interfaces';

export default class SimplifyTrajectory {
  getSqDist(p1: IDataPointMovement, p2: IDataPointMovement) {
    // square distance between 2 points

    var dx = p1.X - p2.X,
      dy = p1.Y - p2.Y;

    return dx * dx + dy * dy;
  }

  // square distance from a point to a segment
  getSqSegDist(p, p1, p2) {

    var x = p1.X,
      y = p1.Y,
      dx = p2.X - x,
      dy = p2.Y - y;

    if (dx !== 0 || dy !== 0) {

      var t = ((p.X - x) * dx + (p.Y - y) * dy) / (dx * dx + dy * dy);

      if (t > 1) {
        x = p2.X;
        y = p2.Y;

      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }

    dx = p.X - x;
    dy = p.Y - y;

    return dx * dx + dy * dy;
  }

  // basic distance-based simplification
  simplifyRadialDist(points:IDataPointMovement[], sqTolerance) {

    var prevPoint = points[0],
      newPoints = [prevPoint],
      point;

    for (var i = 1, len = points.length; i < len; i++) {
      point = points[i];

      if (this.getSqDist(point, prevPoint) > sqTolerance) {
        newPoints.push(point);
        prevPoint = point;
      }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
  }

  simplifyDPStep(points:IDataPointMovement[], first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
      index;

    for (var i = first + 1; i < last; i++) {
      var sqDist = this.getSqSegDist(points[i], points[first], points[last]);

      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }

    if (maxSqDist > sqTolerance) {
      if (index - first > 1) this.simplifyDPStep(points, first, index, sqTolerance, simplified);
      simplified.push(points[index]);
      if (last - index > 1) this.simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
  }

// simplification using Ramer-Douglas-Peucker algorithm
  simplifyDouglasPeucker(points:IDataPointMovement[], sqTolerance) {
    var last = points.length - 1;

    var simplified = [points[0]];
    this.simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
  }

// both algorithms combined for awesome performance
  simplify(points:IDataPointMovement[], tolerance:number, highestQuality?:boolean) {

    if (points.length <= 2) return points;

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
    points = this.simplifyDouglasPeucker(points, sqTolerance);

    return points;
  }

}

