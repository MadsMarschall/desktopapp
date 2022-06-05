import { useContext, useEffect, useState } from 'react';
import { P5Instance, ReactP5Wrapper } from 'react-p5-wrapper';
import { Col, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import { handleTargetNodeConnection, listenForMethods } from '../../../DataHandling/dataUtilityFunctions';
import { IPCEvents, Methods, OperationIds } from '../../../../shared/Constants';
import IDataOperationChainController from '../../../../shared/domain/IDataOperationController';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import IpcRendererImpl from '../../../DataHandling/IpcRendereImpl';
import { IDisplayableData } from '../../../../shared/domain/IOperationMetaData';

let dataOperationChainControllerProxy: IDataOperationChainController;
const canvasX = 1000;
const canvasY = 1000;
let globalOperation: IDataOperation;
let dataPoints: IDataPointMovement[];
let displayableData: IDisplayableData;

interface PositionOnCanvas {
  x: number;
  y: number;
}

function getCanvasPosition(x: number, y: number): PositionOnCanvas {
  return {
    x: (canvasX / 100) * x,
    y: canvasY - (canvasY / 100) * y
  };
}

let setupHolder: () => void;

function sketch(p5: P5Instance) {
  let bg: any;

  const canvasDimensions = {
    x: canvasX,
    y: canvasY
  };
  p5.preload = () => {
    // eslint-disable-next-line global-require
    bg = p5.loadImage(require('/src/renderer/Assets/ParkMap.jpg'));
  };
  p5.setup = () => {
    const colorArray = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
    p5.createCanvas(canvasDimensions.x, canvasDimensions.y);
    p5.background(bg);
    console.log("whaaaaaat")
    if (!dataPoints) return;
    for (let i = 0; i < dataPoints.length; i++) {
      const pos: PositionOnCanvas = getCanvasPosition(dataPoints[i].X, dataPoints[i].Y);
      p5.ellipse(pos.x, pos.y, canvasX / 100, canvasY / 100);
    }
    displayableData.clusterPositions
    setupHolder=p5.setup

  };
}


  export default function ClusterMapNode({ data }: any) {
    dataOperationChainControllerProxy = useContext(ChainControllerContext);
    const [mounted, setMounted] = useState<boolean>(false);
    const [operation, setOperation] = useState<IDataOperation>();

    function onMount() {
      dataOperationChainControllerProxy.createOperationNode(
        OperationIds.CLUSTER_MAP_DISPLAY,
        data.id
      ).then(async (operation) => {
        await setOperation(operation);
        await setMounted(true);
        globalOperation = operation;

        listenForMethods(data.id, [Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD], () => {
          operation.getData().then(async (data) => {
            dataPoints = data;
            displayableData = await operation.getDisplayableData()
            setupHolder();

          });
        });

        return operation;
      });
    }

    useEffect(onMount, []);

    const d = data;
    if (!operation) return <></>;
    return (
      <div className='text-updater-node'>
        <div>
          <Row>
            <Col sm={12}>
              <p>Entries in node: {}</p>
            </Col>
            <Col>{mounted ? <ReactP5Wrapper sketch={sketch} /> : <></>}</Col>
          </Row>
        </div>
        <Handle
          type='target'
          position={Position.Left}
          id='b'
          onConnect={async (params) =>
            handleTargetNodeConnection(
              params,
              operation
            )
          }
        />
      </div>
    );
  }
