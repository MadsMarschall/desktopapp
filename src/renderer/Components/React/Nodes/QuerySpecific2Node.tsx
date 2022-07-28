import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import { TimePicker } from '@mui/x-date-pickers';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Methods, OperationIds, PHONE_CONTROLLER_BASE_URL, RemoteUrls } from '../../../../shared/Constants';
import {
  handleSourceNodeConnection,
  handleTargetNodeConnection,
  listenForMethods
} from '../../../DataHandling/dataUtilityFunctions';
import React, { useContext, useEffect, useState } from 'react';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { ChainControllerContext } from '../../../context/broker';
import QRCode from 'react-qr-code';


export default function GroupsFromMatrixNode({ data }: any) {
  const [operation, setOperation] = useState<IDataOperation>();
  const [threshold, setThreshold] = React.useState<number>();
  const [numberOfGroups, setNumberOfGroups] = useState<number>()
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  function onMount() {
    console.log(`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.AGNES_CLUSTERING}?nodeId=${data.id}`);
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.GROUPS_FROM_MATRIX,
      data.id
    ).then((operation) => {
      listenForMethods(
        data.id,
        [Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD],
        (data) => {
          operation.getDisplayableData().then((data) => {
            if (!data.groups) return;
            setNumberOfGroups(data.groups.length);
          });
        });
      listenForMethods(data.id, [Methods.DATA_OPERATION_SET_SETTINGS], (data) => {
        operation.getSettings().then((res) => {
          setThreshold(res[0]);
        })
      })
      setOperation(operation);
    });
  }

  useEffect(onMount, []);


  return (
    <div className='GroupsFromMatrix'>
      <Handle type={'source'} position={Position.Right}
              id='b'
              onConnect={async (params) => {
                handleSourceNodeConnection(
                  params,
                  await dataOperationChainControllerProxy.getOperationByNodeId(
                    data.id
                  )
                );
              }}>

      </Handle>
      <div className="bg-info p-2">
        <Row>
          <Col>
            <br/>
            <h3>{'Hierahical cluster groups from matrix'}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
            <Form.Control
              type={'number'}
              placeholder="Type in threshold"
              aria-label="Threshold"
              aria-describedby="basic-addon2"
              value={threshold || ""}
              onChange={(e) => {
                setThreshold(Number(e.target.value));
              }}
            />
            <Button variant="outline-secondary" id="button-addon2"
                    onClick={async () => {
                      if (!operation) {
                        console.log('No operation was found selected');
                        setErrorMessage('No operation was found selected');
                        return;
                      }
                      await operation.setSettings([threshold]);
                      await operation.retriggerOperationChainForward();
                      await operation.getDisplayableData().then((res) => {
                        if (!res.groups) return;
                        setNumberOfGroups(res.groups ? res.groups.length: 0);
                      });
                    }}>
              Apply Threshold
            </Button>
            </InputGroup>

          </Col>

        </Row>
        <Row className='p-4 m-4'>
          <Col>
            {/* @ts-ignore */}
            <QRCode
              value={`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.AGNES_CLUSTERING}?nodeId=${data.id}`}
            />
          </Col>
        </Row>
        <p>Groups exported: {numberOfGroups}</p>

        <p>{errorMessage}</p>
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
        }}
      />
    </div>
  );
}
