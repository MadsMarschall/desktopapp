import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';

import QRCode from 'react-qr-code';
import { handleSourceNodeConnection, listenForMethods } from '../../../DataHandling/dataUtilityFunctions';
import { Methods, OperationIds, PHONE_CONTROLLER_BASE_URL, RemoteUrls, TableNames } from '../../../../shared/Constants';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { formatQuery, RuleGroupType, Field, QueryBuilder } from 'react-querybuilder';
import { createTheme, ThemeProvider } from '@mui/material';
import { materialControlElements } from '@react-querybuilder/material';
import QuerySpecific from '../helperComponents/QuerySpecific';





type IProps = {
  data: {
    id: string;
    label: string;
  };
};


export default function QuerySpecificNode({ data }: IProps) {
  const [SelectedTable, setSelectedTable] = useState<TableNames>(
    TableNames.TEST
  );
  const [entriesLoaded, setEntriesLoaded] = useState<number>(0);
  const [operation, setOperation] = useState<IDataOperation>();
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.SELECT_BY_DAY,
      data.id
    ).then((operation) => {
      listenForMethods(
        data.id,
        [Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD],
        (data) => {
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
          console.log(settings);
          if (!settings || settings.length === 0) {
            console.log('No settings found');
            return;
          }
          setSelectedTable(settings[0]);
          console.log('settings', settings);
        });
      });
      setOperation(operation);
    });
  }

  useEffect(onMount, []);

  const d = data;

  const handleClick = async () => {
    if (!SelectedTable) return;
    if (!operation) return;
    await operation.setSettings([SelectedTable]);
    console.log(SelectedTable);
    operation.retriggerOperationChainForward().then(async () => {
      operation.getDisplayableData().then((metaData) => {
        setEntriesLoaded(metaData.entries);
      });
    });
  };



  const parametersAreSelected = SelectedTable === undefined;
  return (
    <div className='selectorNode'>
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
          <Col style={{minWidth:"20em"}}>
            <>
              <Form.Group>
                <Form.Label htmlFor='inputPassword5'>Select Day</Form.Label>
                <Form.Select
                  required
                  className='mt-2'
                  aria-label='Default select example'
                  onChange={(e) => {
                    setSelectedTable(
                      e.target.value as TableNames
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
              <>

                <br/>
                <QuerySpecific/>
              </>
              <br />
              <Button
                type='submit'
                className='w-100 mb-2'
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
