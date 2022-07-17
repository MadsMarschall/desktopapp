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

export default function AgglomerativeClusteringNode({ data }: IProps) {
  const [threshold, setThreshold] = useState<number>(5);
  const [operation, setOperation] = useState<IDataOperation>();
  const [numberOfGroups, setNumberOfGroups] = useState<number>(0);
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
        });

      listenForMethods(data.id, [Methods.DATA_OPERATION_SET_SETTINGS], (data) => {
        if (!operation) {
          console.log('Operation not found');
          return;
        }
      });
      setOperation(operation);
    });

  }

  useEffect(onMount, []);

  const handleClick = async () => {
    if (!operation) return;
    await operation.setSettings([threshold]);
    await operation.retriggerOperationChainForward().then(async () => {
      await operation.getDisplayableData().then((data) => {
        (data.entries);
      });
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
                value={`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.AGNES_CLUSTERING}?nodeId=${data.id}`}
              />
            </div>
          </Col>
          <Col>
            <Row>
              <Col>
                <h3>{"Time Filtering Node"}</h3>
              </Col>
            </Row>
            <Row>

            </Row>
            <Button
              type='submit'
              className='w-100 mb-2'
              onClick={async () => {
                if(!operation) {
                  setErrorMessage('No operation was found selected');
                  return;
                }
                await operation.setSettings([threshold]);
                await operation.retriggerOperationChainForward();
                await operation.getDisplayableData().then((res) => {
                  console.log(res);
                });
              }}            >
              Apply Operation
            </Button>
            {errorMessage}
            <br />
            <p>Groups Exported: {numberOfGroups}</p>

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
              setNumberOfGroups(res.entries);
            });
          }
        }}
      />
    </div>
  );
}
