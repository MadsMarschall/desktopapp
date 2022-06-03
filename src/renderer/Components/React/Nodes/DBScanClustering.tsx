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

type IProps = {
  data: {
    id: string;
    label: string;
  };
};

export default function DBScanClustering({ data }: IProps) {
  const [eps, setEps] = useState(0.075);
  const [minPts, setMinPts] = useState(1);
  const [timeEps, setTimeEps ] = useState(2000);
  const [useTimeEps, setUseTimeEps] = useState(false);
  const [entriesLoaded, setEntriesLoaded] = useState<number>(0);
  const [operation, setOperation] = useState<IDataOperation>();
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.DBSCAN_CLUSTERING,
      data.id
    ).then((operation) => {
      listenForMethods(
        data.id,
        [Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD],
        (data) => {
          operation.getData().then((data) => {
            setEntriesLoaded(data.length);
          });
        })

      listenForMethods(data.id,[Methods.DATA_OPERATION_SET_SETTINGS],(data)=>{
        if(!operation) {
          console.log("Operation not found");
          return;
        }
        operation.getSettings().then((settings:any[])=>{
          console.log("settings",settings);
        })
      })
      setOperation(operation);
    });

  }

  useEffect(onMount, []);

  const d = data;

  const handleClick = async () => {
    if (!operation) return;
    await operation.setSettings([eps, minPts,]);
    await operation.retriggerOperationChainForward().then(async () => {
      console.log((await operation.getData()).length)
          setEntriesLoaded((await operation.getData()).length);
    });
  };


  return (
    <div className="selectorNode">
      <Handle
        type="source"
        position={Position.Right}
        id="b"
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
        <Row className="bg-info p-4 m-4">
          <Col>
            <div style={{ background: 'white', padding: '16px' }}>
              {/* @ts-ignore */}
              <QRCode
                value={`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.DBSCAN_NODE}?nodeId=${data.id}`}
              />
            </div>
          </Col>
          <Col>
            <>
              <Form.Group>
                <Form.Label htmlFor="inputPassword5">EPS</Form.Label>
                <Form.Control
                  type="number"
                  id="PersonIdSelection"
                  defaultValue={eps}
                  value={eps || ''}
                  onChange={(e) => {
                    setEps(parseInt(e.target.value, 10));
                  }}
                />
                <Form.Control
                  type="number"
                  id="PersonIdSelection"
                  defaultValue={minPts}
                  value={minPts || ''}
                  onChange={(e) => {
                    setMinPts(parseInt(e.target.value, 10));
                  }}
                />
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Use time"
                  checked={useTimeEps}
                  onChange={(e) => {
                    setUseTimeEps(e.target.checked);
                  }}
                />
                {useTimeEps && (
                  <Form.Control
                    type="number"
                    id="PersonIdSelection"
                    defaultValue={timeEps}
                    value={timeEps || ''}
                    onChange={(e) => {
                      setTimeEps(parseInt(e.target.value, 10));
                    }}
                  />
                )}
              </Form.Group>
              <br />
              <Button
                type="submit"
                className="w-100 mb-2"
                onClick={handleClick}
              >
                Apply Operation
              </Button>
              <br />
              <p>Entries loaded: {entriesLoaded}</p>
            </>

          </Col>
        </Row>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="b"
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
