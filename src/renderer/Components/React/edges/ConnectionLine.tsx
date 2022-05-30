import { ConnectionLineComponent } from 'react-flow-renderer';

const ConnectionLine:ConnectionLineComponent = ({
                  sourceX,
                  sourceY,
                  sourcePosition,
                  targetX,
                  targetY,
                  targetPosition,
                  connectionLineType,
                  connectionLineStyle
                }) => {
  return (
    <g>
      <path
        fill='none'
        stroke='#fff'
        strokeWidth={5}
        className='animated'
        d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
      />
      <circle cx={targetX} cy={targetY} fill='#fff' r={3} stroke='#222' strokeWidth={1.5} />
    </g>
  );
};
 export default ConnectionLine;
