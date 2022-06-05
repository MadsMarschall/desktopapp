import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';

import QRCode from 'react-qr-code';
import { handleSourceNodeConnection, listenForMethods } from '../../../DataHandling/dataUtilityFunctions';
import { Methods, OperationIds, PHONE_CONTROLLER_BASE_URL, RemoteUrls, TableNames } from '../../../../shared/Constants';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { DateTimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

type IProps = {
  data: {
    id: string;
    label: string;
  };
};

export default function SelectByDayAndTimeNode({ data }: IProps) {
  const [SelectedTable, setSelectedTable] = useState<string>(
    TableNames.TEST
  );
  const [lowerBound, setLowerBound] = React.useState<Date>(new Date('2014-06-06 08:00:00'));
  const [upperBound, setUpperBound] = React.useState<Date>(new Date('2014-06-08 23:59:59'));
  const [entriesLoaded, setEntriesLoaded] = useState<number>(0);
  const [operation, setOperation] = useState<IDataOperation>();
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.SELECT_BY_TIME_AND_DAY,
      data.id
    ).then(async (operation) => {
      await operation.setSettings(
        [lowerBound,
          upperBound,
          SelectedTable]
      );
      listenForMethods(data.id, [Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD], (data) => {
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
          setLowerBound(settings[0]);
          setUpperBound(settings[1]);
          setSelectedTable(settings[2]);

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
    await operation.setSettings([lowerBound.valueOf(), upperBound.valueOf(), SelectedTable]);
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
          <Col>
            <div style={{ background: 'white', padding: '16px' }}>
              {/* @ts-ignore */}
              <QRCode
                value={`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.SELECT_BY_TIME_AND_DAY}?nodeId=${data.id}`}
              />
            </div>
          </Col>
          <Col>
            <>
              <Form.Group>
                <Form.Label htmlFor='inputPassword5'>Select Day</Form.Label>
                <Form.Select
                  required
                  className='mt-2'
                  aria-label='Default select example'
                  onChange={(e) => {
                    setSelectedTable(e.target.value as TableNames);
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
              <div>
                <DateTimePicker
                  label='Upper Bound'
                  value={upperBound}
                  onChange={(newValue) => {
                    if (newValue) setUpperBound(newValue);
                  }}
                  ampm={false}
                  renderInput={(params) => <TextField {...params} />}
                />
                <br />
                <br />
                <DateTimePicker
                  label='Lower Bound'
                  value={lowerBound}
                  onChange={(newValue) => {
                    if (newValue) setLowerBound(newValue);
                  }}
                  ampm={false}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
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
  )
    ;
}
