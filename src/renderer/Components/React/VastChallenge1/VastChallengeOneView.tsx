import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  ReactFlowInstance,
} from 'react-flow-renderer';
import '../../Sass/DataSourceNode.scss';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import DataSourceNode from '../Nodes/DataSourceNode';
import Sidebar from '../UI/Sidebar';
import MapNode from '../Nodes/MapNode';
import SelectorNode from '../Nodes/SelectorNode';
import { ChainControllerContext } from '../../../context/broker';
import ConnectionLine from '../edges/ConnectionLine';
import SelectByDayNode from '../Nodes/SelectByDayNode';
import DBScanClusteringNode from '../Nodes/DBScanClusteringNode';
import TimeFilteringNode from '../Nodes/TimeFilteringNode';
import ClusterMapNode from '../Nodes/ClusterMapNode';
import QuerySpecificNode from '../Nodes/QuerySpecificNode';
import SelectByDayAndTimeNode from '../Nodes/SelectByDayAndTimeNode';

const nodeTypes = {
  dataSource: DataSourceNode,
  map: MapNode,
  clusterMap: ClusterMapNode,
  selector: SelectorNode,
  timeFiltering: TimeFilteringNode,
  selectByDay:SelectByDayNode,
  dbScanClustering: DBScanClusteringNode,
  querySpecific: QuerySpecificNode,
  selectByDayAndTime: SelectByDayAndTimeNode
};

const id = 10;
export default function VastChallengeOneView() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lastEdgeArray: Edge[] = [];
  useEffect(() => {
    const changes: Edge[] = _.xor(lastEdgeArray, edges);
  }, [edges, lastEdgeArray]);

  const onNodesChange = useCallback(
    (changes: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setNodes((nds: Node) => {
        // @ts-ignore
        return applyNodeChanges(changes, nds);
      });
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => {
      setEdges((eds) => {
        console.log(eds);
        return applyEdgeChanges(changes, eds);
      });
    },
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: any) => {
      setEdges((eds) => {
        return addEdge(connection, eds);
      });
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) {
        return;
      }
      // @ts-ignore
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // @ts-ignore
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const uuid = uuidv4();
      const newNode = {
        id: `${type}_${uuid}`,
        type,
        position,
        data: { label: `${type} node`, id: `${type}_${uuid}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="ReactFlowDataTool vw-100 vh-100">
      <div className="reactflow-wrapper h-100" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // @ts-ignore
          nodeTypes={nodeTypes}
          onInit={(d) => setReactFlowInstance(d)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          connectionLineComponent={ConnectionLine}
          className="mainReactFlow"
          fitView
        />
      </div>
      <div className="position-absolute nodeControlPanel">
        <Sidebar />
      </div>
    </div>
  );
}
