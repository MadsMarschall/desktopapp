import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import { Pause, Play, SkipBackward } from 'react-bootstrap-icons';

import {
  handleSourceNodeConnection,
  handleTargetNodeConnection,
} from '../../../DataHandling/dataUtilityFunctions';
import { dataOperationChainControllerProxy } from '../../../DataHandling/DataOperationChainControllerProxy';
import '../../Sass/SliderStyle.scss';
import { OperationIds } from '../../../../shared/Constants';
import ISubject from '../../../../shared/domain/ISubject';

let intervalHolder: ReturnType<typeof setInterval> | null;
const delayBetweenIterations = 50;

const LOWER_TIME_BOUND: number = new Date('2014-06-06 08:00:00').getTime();
const UPPER_TIME_BOUND: number = new Date('2014-06-08 23:59:59').getTime();
let timeCounter = LOWER_TIME_BOUND;

export default function TimePlayerNode({ data }: any) {
  const [timeBoundaries, setTimeBoundaries] = useState<{
    lower: number;
    upper: number;
  }>({ lower: LOWER_TIME_BOUND, upper: UPPER_TIME_BOUND });
  const [currentTime, setCurrentTime] = useState<string>(
    new Date(LOWER_TIME_BOUND).toString()
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const onMount = () => {
    const subject: ISubject =
      dataOperationChainControllerProxy.createOperationNode(
        OperationIds.TIME_PLAYER,
        data.id
      ) as unknown as ISubject;
    // subject.addObserver(new Observer(dataUpdate));
  };
  const dataUpdate = () => {
    const sourceData = dataOperationChainControllerProxy
      .createOperationNode(OperationIds.TIME_PLAYER, data.id)
      .getSource()
      .getData();

    if (sourceData.length === 0) return;

    const lowerBound = sourceData[0].timestamp.getTime();
    const upperBound = sourceData[sourceData.length - 1].timestamp.getTime();

    setCurrentTime(sourceData[0].timestamp.toString());
    setTimeBoundaries({ lower: lowerBound, upper: upperBound });
    console.log('TimePlayerNode: dataUpdate: ', sourceData);
  };

  useEffect(onMount, []);

  function playing() {
    timeCounter += 1000;
    setCurrentTime(new Date(timeCounter).toString());
    console.log('playing');
    console.log(timeCounter);
  }

  function Restart() {}

  function play() {
    if (intervalHolder != null) return;

    setIsPlaying(true);
    intervalHolder = setInterval(playing, delayBetweenIterations);
  }

  function pause() {
    if (intervalHolder == null) return;

    clearInterval(intervalHolder);
    intervalHolder = null;
    setIsPlaying(false);
  }

  return (
    <div className="timeSliderNode">
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        onConnect={(params) => {
          handleSourceNodeConnection(
            params,
            dataOperationChainControllerProxy.getOperationByNodeId(data.id)
          );
        }}
      />
      <Container style={{ backgroundColor: '#e18b71' }}>
        <Row className="justify-content-center">
          <Col sm={6}>
            <h3>Current Time:</h3>
            <p>{currentTime}</p>
          </Col>
        </Row>
        <Row className="p-5">
          <Col>
            <Button onClick={Restart}>
              <SkipBackward />
            </Button>
            <Button onClick={play} disabled={isPlaying}>
              <Play />
            </Button>
            <Button onClick={pause} disabled={!isPlaying}>
              <Pause />
            </Button>
          </Col>
        </Row>
      </Container>

      <Handle
        type="target"
        position={Position.Left}
        id="b"
        onConnect={(params) => {
          handleTargetNodeConnection(
            params,
            dataOperationChainControllerProxy.getOperationByNodeId(data.id)
          );
        }}
      />
    </div>
  );
}
