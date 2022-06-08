import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';

import QRCode from 'react-qr-code';
import { handleSourceNodeConnection, listenForMethods } from '../../../DataHandling/dataUtilityFunctions';
import { Methods, OperationIds, PHONE_CONTROLLER_BASE_URL, RemoteUrls, TableNames } from '../../../../shared/Constants';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';

type IProps = {
  data: {
    id: string;
    label: string;
  };
};

export default function SelectorNode({ data }: IProps) {
  const [PersonId, setPersonId] = useState<number>(0);
  const [entriesLoaded, setEntriesLoaded] = useState<number>(0);
  const [operation, setOperation] = useState<IDataOperation>();
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.SELECT_FROM_DB,
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
          setPersonId(settings[1]);
          console.log("settings",settings);
        })
      })
      setOperation(operation);
    });
  }

  useEffect(onMount, []);

  const d = data;

  const handleClick = async () => {
    if (!PersonId) return;
    if (!operation) return;
    await operation.setSettings([PersonId]);
    await operation.retriggerOperationChainForward().then(async () => {
      console.log((await operation.getData()).length)
          setEntriesLoaded((await operation.getData()).length);
    });
  };


  const parametersAreSelected =
    PersonId === undefined;
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
                value={`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.SELECTOR_NODE}?nodeId=${data.id}`}
              />
            </div>
          </Col>
          <Col>
            <>
              <Form.Group>
                <Form.Label htmlFor="inputPassword5">Select Person</Form.Label>
                <Form.Control
                  type="number"
                  id="PersonIdSelection"
                  placeholder="Type in PersonId"
                  value={PersonId || ''}
                  onChange={(e) => {
                    setPersonId(parseInt(e.target.value, 10));
                  }}
                />
              </Form.Group>
              <br />
              <Button
                type="submit"
                className="w-100 mb-2"
                disabled={parametersAreSelected}
                onClick={handleClick}
              >
                Get Data
              </Button>
              <br />
              <p>Entries loaded: {entriesLoaded}</p>
            </>
          </Col>
        </Row>
      </div>
    </div>
  );
}
