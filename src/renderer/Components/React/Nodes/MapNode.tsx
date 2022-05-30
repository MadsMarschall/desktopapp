import { useContext, useEffect, useState } from 'react';
import { P5Instance, ReactP5Wrapper } from 'react-p5-wrapper';
import { Col, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import { handleTargetNodeConnection } from '../../../DataHandling/dataUtilityFunctions';
import { settingsAPI } from '../../../Utilities/SettingsAPIController';
import { OperationIds } from '../../../../shared/Constants';
import IDataOperationChainController from '../../../../shared/domain/IDataOperationController';
import { ChainControllerContext } from '../../../context/broker';

let dataOperationChainControllerProxy: IDataOperationChainController;
const canvasX = 1000;
const canvasY = 1000;
let operationID: string;
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
    bg = p5.loadImage(require('../../../Assets/ParkMap.jpg'));
  };
  p5.setup = () => {
    p5.createCanvas(canvasDimensions.x, canvasDimensions.y);
    p5.frameRate(5);
  };

  p5.draw = async () => {
    if (!operationID) return;
    p5.background(bg);
    if (!dataOperationChainControllerProxy) return;
    const operation =
      await dataOperationChainControllerProxy.getOperationByNodeId(operationID);
    const data = await operation.getData();
    for (let i = 0; i < data.length; i++) {
      const pos: PositionOnCanvas = getCanvasPosition(data[i].X, data[i].Y);
      p5.ellipse(pos.x, pos.y, canvasX / 100, canvasY / 100);
    }
  };
}

export default function MapNode({ data }: any) {
  dataOperationChainControllerProxy = useContext(ChainControllerContext);
  const [PersonId, setPersonId] = useState<number>(0);
  // @ts-ignore
  const [StrapiId, setStrapiId] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [MetaData, setMetaData] = useState<{ entries: number }>();
  const [mounted, setMounted] = useState<boolean>(false);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.MAP_DISPLAY,
      data.id
    );
    operationID = data.id;
    // eslint-disable-next-line promise/catch-or-return
    settingsAPI.createMapSettings(data.id).then((strapiId) => {
      setStrapiId(strapiId);
    });
    setMounted(true);
  }

  useEffect(onMount, []);

  const d = data;
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
            await dataOperationChainControllerProxy.getOperationByNodeId(
              data.id
            )
          )
        }
      />
    </div>
  );
}
