import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useContext, useEffect, useState } from 'react';
import { RemoteSocketContext } from '../context/socket';
import { TableNames } from '../../../../shared/Constants';
import { IpcSocketContext } from '../context/ipcsocket';
import { useLocation } from 'react-router-dom';
import { ClientRequestor } from '../../../../shared/domain/ClientRequestor';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import DataOperationProxy from '../../../../shared/datatools/DataOperationProxy';
import { Slider, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function SelectByTimeAndDayController(): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [lowerBound, setLowerBound] = React.useState<Date>(new Date('2014-06-06 08:00:00'));
  const [upperBound, setUpperBound] = React.useState<Date>(new Date('2014-06-08 23:59:59'));
  const [entries, setEntries] = React.useState<number>();
  const [SelectedTable, setSelectedTable] = useState<string>(
    TableNames.TEST
  );


  const [operation, setOperation] = React.useState<IDataOperation>();
  const socket = useContext(RemoteSocketContext);
  const ipc = useContext<ClientRequestor>(IpcSocketContext);
  let query: URLSearchParams;

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  function valuetext(value: Date) {
    return `Time: ${value.toLocaleTimeString()}`;
  }

  useEffect(() => {
    if (!operation) return;
    operation.setSettings([lowerBound, upperBound]);
  }, [lowerBound, upperBound]);
  query = useQuery();
  socket.on('connect', async () => {
    if (query.get('nodeId')) {
      let operationTemp = new DataOperationProxy(query.get('nodeId') as string, ipc);
      setOperation(operationTemp);
      await operationTemp.getSettings().then((res) => {
        setLowerBound(res[0]);
        setUpperBound(res[1]);
      });
      console.log(await operationTemp.getType(), 'proxy');
    }
  });
  socket.on('disconnect', () => {
    setErrorMessage('Disconnected from server');
  });
  return (
    <Container>
      <Row>
        <Col>

          <Row>
            <Col>
              <h3>{'Time Filtering Node'}</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <>
                <Form.Group>
                  <Form.Label htmlFor='inputPassword5'>Select By Time And Day</Form.Label>
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
                <br />
              </>
            </Col>
          </Row>

          <br />
          <Button
            type='submit'
            className='w-100 mb-2'
            onClick={async () => {
              if (!operation) {
                setErrorMessage('No operation was found selected');
                return;
              }
              await operation.setSettings([lowerBound.valueOf(), upperBound.valueOf(), SelectedTable]);
              await operation.retriggerOperationChainForward();
              await operation.getDisplayableData().then((res) => {
                setEntries(res.entries);
              });
            }}>
            Apply Operation
          </Button>
          <br />
          <p>Entries out: {entries}</p>

          <p>{errorMessage}</p>
        </Col>
      </Row>
    </Container>
  );
}
