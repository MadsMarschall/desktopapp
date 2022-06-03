import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';

import QRCode from 'react-qr-code';
import {
  handleSourceNodeConnection,
  handleTargetNodeConnection,
  listenForMethods
} from '../../../DataHandling/dataUtilityFunctions';
import { Methods, OperationIds, PHONE_CONTROLLER_BASE_URL, RemoteUrls, TableNames } from '../../../../shared/Constants';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { Slider, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';

type IProps = {
  data: {
    id: string;
    label: string;
  };
};

export default function TimeFilteringNode({ data }: IProps) {
  const [lowerBound, setLowerBound] = React.useState<Date>(new Date("2014-06-06 08:00:00"));
  const [upperBound, setUpperBound] = React.useState<Date>(new Date("2014-06-08 23:59:59"));
  const [entriesLoaded, setEntriesLoaded] = useState<number>(0);
  const [operation, setOperation] = useState<IDataOperation>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.TIME_FILTERING_OPERATION,
      data.id
    ).then((operation) => {
      listenForMethods(
        data.id,
        [Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD],
        (data) => {
          console.log("Received data: ", data);
          operation.getDisplayableData().then((data) => {
            setEntriesLoaded(data.entries);
          });
        });

      listenForMethods(data.id, [Methods.DATA_OPERATION_SET_SETTINGS], (data) => {
        if (!operation) {
          console.log('Operation not found');
          return;
        }
        operation.getSettings().then((settings: any[]) => {
          setLowerBound(new Date(settings[0]));
          setUpperBound(new Date(settings[1]));
        });
      });
      setOperation(operation);
    });

  }

  useEffect(onMount, []);

  const d = data;

  const handleClick = async () => {
    if (!operation) return;
    await operation.setSettings([lowerBound.valueOf(), upperBound.valueOf()]);
    await operation.retriggerOperationChainForward().then(async () => {
      setEntriesLoaded((await operation.getDisplayableData()).entries);
    });
  };
  function valuetext(value: Date) {
    return `Time: ${value.toLocaleTimeString()}`;
  }


  return (
    <div className='timeFilteringNode'>
      <Handle
        type='source'
        position={Position.Right}
        id='b'
        onConnect={async (params) => {
          handleSourceNodeConnection(
            params,
            await dataOperationChainControllerProxy.getOperationByNodeId(
              data.id
            )
          );
        }}
      />
      <div>
        <Row className='bg-info p-4 m-4'>
          <Col>
            <div style={{ background: 'white', padding: '16px' }}>
              {/* @ts-ignore */}
              <QRCode
                value={`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.TIME_FILTERING}?nodeId=${data.id}`}
              />
            </div>
          </Col>
          <Col>
            <Row>
              <Col>
                <h3>{"Time Filtering Node"}</h3>
              </Col>
            </Row>
            <div style={{minWidth:"15em"}}>

                <DateTimePicker
                  label="Upper Bound"
                  value={upperBound}
                  onChange={(newValue) => {
                    if(newValue) setUpperBound(newValue);
                  }}
                  ampm={false}
                  renderInput={(params) => <TextField {...params} />}
                />
                <br/>
                <br/>
                <DateTimePicker
                  label="Lower Bound"
                  value={lowerBound}
                  onChange={(newValue) => {
                    if(newValue) setLowerBound(newValue);
                  }}
                  ampm={false}
                  renderInput={(params) => <TextField {...params} />}
                />
            </div>
            <Button
              type='submit'
              className='w-100 mb-2'
              onClick={async () => {
                if(!operation) {
                  setErrorMessage('No operation was found selected');
                  return;
                }
                await operation.setSettings([lowerBound.valueOf(), upperBound.valueOf()]);
                await operation.retriggerOperationChainForward();
                await operation.getDisplayableData().then((res) => {
                  console.log(res);
                  setEntriesLoaded(res.entries);
                });
              }}            >
              Apply Operation
            </Button>
            {errorMessage}
            <br />
            <p>Entries out: {entriesLoaded}</p>

          </Col>
        </Row>
      </div>
      <Handle
        type='target'
        position={Position.Left}
        id='b'
        onConnect={async (params) => {
          handleTargetNodeConnection(
            params,
            await dataOperationChainControllerProxy.getOperationByNodeId(
              data.id
            )
          );
          if(operation) {
            await operation.getDisplayableData().then((res) => {
              setEntriesLoaded(res.entries);
            });
          }
        }}
      />
    </div>
  );
}
