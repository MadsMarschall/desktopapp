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

export default function DBScanClusteringNode({ data }: IProps) {
  const [eps, setEps] = useState(5);
  const [minPts, setMinPts] = useState(20);
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
          operation.getDisplayableData().then((data) => {
            setEntriesLoaded(data.entries);
          });
        })

      listenForMethods(data.id,[Methods.DATA_OPERATION_SET_SETTINGS],(data)=>{
        if(!operation) {
          console.log("Operation not found");
          return;
        }
        operation.getSettings().then((settings:any[])=>{
          console.log("settings",settings);
          if(settings.length > 0) {

            setEps(settings[0]||0.075);
            setMinPts(settings[1]||1);
            setUseTimeEps(settings[2]||false);
            setTimeEps(settings[3]||2000);

          }
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
          setEntriesLoaded((await operation.getDisplayableData()).entries);
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
                <Form.Label htmlFor="inputPassword5">Epsilon </Form.Label>
                <Form.Control
                  type="number"
                  id="PersonIdSelection"
                  value={eps || ''}
                  onChange={(e) => {
                    setEps(parseInt(e.target.value, 10));
                  }}
                />
                <br/>
                <Form.Label htmlFor="inputPassword5">Minimum Points</Form.Label>

                <Form.Control
                  type="number"
                  id="PersonIdSelection"
                  value={minPts || ''}
                  onChange={(e) => {
                    setMinPts(parseInt(e.target.value, 10));
                  }}
                />
                <br/>

                <Form.Label htmlFor="inputPassword5">Use Time Parameter</Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Use time"
                  checked={useTimeEps}
                  onChange={(e) => {
                    setUseTimeEps(e.target.checked);
                  }}
                />
                <br/>
                <Form.Label htmlFor="inputPassword5">Time Parameter</Form.Label>
                {useTimeEps && (
                  <Form.Control
                    type="number"
                    id="PersonIdSelection"
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
