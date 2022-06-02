import { useContext, useEffect, useState } from 'react';
import { P5Instance, ReactP5Wrapper } from 'react-p5-wrapper';
import { Col, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import { handleTargetNodeConnection } from '../../../DataHandling/dataUtilityFunctions';
import { IPCEvents, OperationIds } from '../../../../shared/Constants';
import IDataOperationChainController from '../../../../shared/domain/IDataOperationController';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { IDataPointMovement } from '../../../../shared/domain/Interfaces';
import IpcRendererImpl from '../../../DataHandling/IpcRendereImpl';

let dataOperationChainControllerProxy: IDataOperationChainController;
const canvasX = 1000;
const canvasY = 1000;
let globalOperation: IDataOperation;
let dataPoints: IDataPointMovement[];

interface PositionOnCanvas {
  x: number;
  y: number;
}

function getCanvasPosition(x: number, y: number): PositionOnCanvas {
  return {
    x: (canvasX / 100) * x,
    y: canvasY - (canvasY / 100) * y,
  };
}
function sketch(p5: P5Instance) {
  let bg: any;

  const canvasDimensions = {
    x: canvasX,
    y: canvasY,
  };
  p5.preload = () => {
    // eslint-disable-next-line global-require
    bg = p5.loadImage(require('/src/renderer/Assets/ParkMap.jpg'));
  };
  p5.setup = () => {
    p5.createCanvas(canvasDimensions.x, canvasDimensions.y);
    p5.frameRate(5);
  };

  p5.draw = async () => {
    p5.background(bg);
    if(!dataPoints) return;
    for (let i = 0; i < dataPoints.length; i++) {
      const pos: PositionOnCanvas = getCanvasPosition(dataPoints[i].X, dataPoints[i].Y);
      p5.ellipse(pos.x, pos.y, canvasX / 100, canvasY / 100);
    }
  };
}


export default function MapNode({ data }: any) {
  dataOperationChainControllerProxy = useContext(ChainControllerContext);
  const [mounted, setMounted] = useState<boolean>(false);
  const [operation, setOperation] = useState<IDataOperation>();

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.MAP_DISPLAY,
      data.id
    ).then(async (operation) => {
      await setOperation(operation);
      await setMounted(true);
      dataPoints = await operation.getData();
      globalOperation = operation;

      window.electron.ipcRenderer.on(IPCEvents.UPDATE, async (event: any, data: any) => {
        console.log("something Updated")
        operation.getSource().then(async (e)=>{
          console.log(await e.getType())
        })
        if (!operation) return;
        dataPoints = await operation.getData();
      });

      return operation;
    });
  }
  useEffect(onMount, []);

  const d = data;
  if(!operation) return <></>;
  return (
    <div className="text-updater-node">
      <div>
        <Row>
          <Col sm={12}>
            <p>Entries in node: {}</p>
          </Col>
          <Col>{mounted ? <ReactP5Wrapper sketch={sketch} /> : <></>}</Col>
        </Row>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="b"
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
