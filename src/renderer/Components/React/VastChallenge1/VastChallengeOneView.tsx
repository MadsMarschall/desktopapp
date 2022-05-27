import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import DataOperationChainController from '../../../DataHandling/DataOperationChainControllerProxy';
import MapNode from '../Nodes/MapNode';
import SelectorNode from '../Nodes/SelectorNode';
import TimeSliderNode from '../Nodes/TimeSliderNode';
import TimePlayerNode from '../Nodes/TimePlayerNode';
import { OperationIds } from '../../../../shared/Constants';

const nodeTypes = {
  dataSource: DataSourceNode,
  map: MapNode,
  selector: SelectorNode,
  timeSlider: TimeSliderNode,
  timePlayer: TimePlayerNode,
};

const id = 10;
const chainController = new DataOperationChainController();
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
        changes.forEach((n: any) => {
          chainController.createOperationNode(OperationIds.DATASOURCE, n.id);
        });
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
      <div className="reactflow-wrapper h-75" ref={reactFlowWrapper}>
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
          className="mainReactFlow"
          fitView
        />
      </div>
      <Sidebar />
    </div>
  );
}
