import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';

import QRCode from 'react-qr-code';
import { Socket } from 'socket.io-client';
import { dataOperationChainControllerProxy } from '../../../DataHandling/DataOperationChainControllerProxy';
import { settingsAPI } from '../../../Utilities/SettingsAPIController';
import { SocketContext } from '../../../context/socket';
import { handleSourceNodeConnection } from '../../../DataHandling/dataUtilityFunctions';
import {
  OperationIds,
  PHONE_CONTROLLER_BASE_URL,
  TableNames,
} from '../../../../shared/Constants';

type IProps = {
  data: {
    id: string;
    label: string;
  };
};

export default function SelectorNode({ data }: IProps) {
  const [PersonId, setPersonId] = useState<number>(0);
  const [SelectedTable, setSelectedTable] = useState<TableNames>(
    TableNames.TEST
  );
  const [StrapiId, setStrapiId] = useState<number>(0);
  const [entriesLoaded, setEntriesLoaded] = useState<number>(0);
  const socket = useContext<Socket>(SocketContext);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.SELECT_FROM_DB,
      data.id
    );
    settingsAPI
      .createSelectorSettings(data.id, PersonId, SelectedTable)
      .then((strapiId) => {
        setStrapiId(strapiId);
        socket.on('selector-node-setting:update', () => {});
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(onMount, []);

  const d = data;

  const handleClick = async () => {
    if (!StrapiId) return;
    if (!SelectedTable) return;
    if (!PersonId) return;
    const operation = dataOperationChainControllerProxy.getOperationByNodeId(
      data.id
    );
    operation.setSettings([SelectedTable, PersonId]);
    await dataOperationChainControllerProxy
      .getOperationByNodeId(data.id)
      .retriggerOperationChainForward()
      .then(() => {
        setEntriesLoaded(
          dataOperationChainControllerProxy
            .getOperationByNodeId(data.id)
            .getData().length
        );
      });
  };

  const handleGetData = async (strapiId: number) => {
    await settingsAPI.getSelectorNodeSetting(strapiId).then((res) => {
      setPersonId(parseInt(res.attributes.PersonId, 10));
      setSelectedTable(res.attributes.TableName);
      dataOperationChainControllerProxy
        .getOperationByNodeId(data.id)
        .setSettings([
          res.attributes.TableName,
          parseInt(res.attributes.PersonId, 10),
        ]);
      dataOperationChainControllerProxy
        .getOperationByNodeId(data.id)
        .retriggerOperationChainForward()
        .then(() => {
          setEntriesLoaded(
            dataOperationChainControllerProxy
              .getOperationByNodeId(data.id)
              .getData().length
          );
        });
    });
  };

  const parametersAreSelected =
    PersonId === undefined && SelectedTable === undefined;
  return (
    <div className="selectorNode">
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
      <div>
        <Row className="bg-info p-4 m-4">
          <Col>
            <div style={{ background: 'white', padding: '16px' }}>
              {/* @ts-ignore */}
              <QRCode
                value={`${PHONE_CONTROLLER_BASE_URL}/selectornode?StrapiId=${StrapiId}`}
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
                <Form.Select
                  required
                  className="mt-2"
                  aria-label="Default select example"
                  onChange={(e) => {
                    setSelectedTable(
                      parseInt(e.target.value, 10) as unknown as TableNames
                    );
                  }}
                  value={SelectedTable}
                >
                  <option>Please select day</option>
                  <option value={TableNames.FRIDAY}>Friday</option>
                  <option value={TableNames.SATURDAY}>Saturday</option>
                  <option value={TableNames.SUNDAY}>Sunday</option>
                </Form.Select>
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
