import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import ReactSlider from 'react-slider';
import {
  handleSourceNodeConnection,
  handleTargetNodeConnection
} from '../../../DataHandling/dataUtilityFunctions';
import '../../Sass/SliderStyle.scss';
import { OperationIds } from '../../../../shared/Constants';
import { ChainControllerContext } from '../../../context/broker';

export default function TimeSliderNode({ data }: any) {
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  const [TimeOfDay, setTimeOfDay] = useState<Date>(new Date());
  const [StrapiId, setStrapiId] = useState<number>(0);
  const [DataPresent, setDataPresent] = useState<boolean>(false);
  const [sliderSettings, setSliderSettings] = useState<{
    max: number;
    min: number;
  }>();
  const [LowerBound, setLowerBound] = useState<number>(1401919200000);
  const [UpperBound, setUpperBound] = useState<number>(1402178400000);
  const [DataBounds, setDataBounds] = useState<{
    lower: number;
    upper: number;
  }>({ lower: 1401919200000, upper: 1402178400000 });

  const handlerSliderChange = (
    value: number | readonly number[],
    index: number
  ) => {
    if (!Array.isArray(value)) return;
    setLowerBound(value[0]);
    setUpperBound(value[1]);
  };
  const onSliderValueChange = () => {
    (async function() {
      if (!dataOperationChainControllerProxy.getOperationByNodeId(data.id))
        return;
      const operation = await dataOperationChainControllerProxy
        .getOperationByNodeId(data.id);
      await operation.setSettings([LowerBound, UpperBound]);
      await operation.retriggerOperationChainForward();
    })();
  };

  useEffect(onSliderValueChange, [LowerBound, UpperBound]);

  function onMount() {
    (async function() {
      const operation = await dataOperationChainControllerProxy.createOperationNode(OperationIds.TIME_SLIDER, data.id);
      await operation.getData();
    })();
  }

  useEffect(onMount, []);

  const updateBoundariesOnConnect = async () => {
    const operation = await dataOperationChainControllerProxy.getOperationByNodeId(data.id);
    const loadedData = await operation.getData();
    if (loadedData.length <= 1) return;
    const lower = loadedData[0].timestamp.getTime();
    const upper = loadedData[loadedData.length - 1].timestamp.getTime();
    console.log(lower, upper);
    setLowerBound(lower);
    setUpperBound(upper);
    setDataBounds({ lower, upper });
  };

  const d = data;
  return (
    <div className='timeSliderNode'>
      <Handle
        type='source'
        position={Position.Right}
        id='b'
        onConnect={async (params) => {
          handleSourceNodeConnection(
            params,
            await dataOperationChainControllerProxy.getOperationByNodeId(data.id)
          );
        }}
      />
      <Container className='p-5' style={{ backgroundColor: '#e18b71' }}>
        <Row style={{ minWidth: '600px', zIndex: 100 }}>
          <Col sm={12}>
            <Row className='justify-content-between'>
              <Col sm={3}>{`${new Date(LowerBound).toString()}`}</Col>
              <Col className='text-right' sm={3}>
                {`${new Date(UpperBound).toString()}`}
              </Col>
            </Row>
          </Col>
          <Col>
            <ReactSlider
              className='horizontal-slider'
              thumbClassName='example-thumb'
              trackClassName='example-track'
              min={DataBounds.lower}
              max={DataBounds.upper}
              onChange={handlerSliderChange}
              defaultValue={[LowerBound + 1, UpperBound - 1]}
              ariaLabel={['Lower thumb', 'Upper thumb']}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              renderThumb={(props, state) => <div {...props}>{}</div>}
              pearling
            />
          </Col>
        </Row>
      </Container>
      <Handle
        type='target'
        position={Position.Left}
        id='b'
        onConnect={async (params) => {
          handleTargetNodeConnection(
            params,
            await dataOperationChainControllerProxy.getOperationByNodeId(data.id)
          );
          updateBoundariesOnConnect();
        }}
      />
    </div>
  );
}
