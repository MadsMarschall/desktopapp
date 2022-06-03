import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
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

export default function TimeFilteringController(): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [lowerBound, setLowerBound] = React.useState<Date>(new Date("2014-06-06 08:00:00"));
  const [upperBound, setUpperBound] = React.useState<Date>(new Date("2014-06-08 23:59:59"));
  const [entries, setEntries] = React.useState<number>();


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
  }, [lowerBound,upperBound]);
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
        <Col className='pt-5'>
          <>
            <Col>
              <Row>
                <Col>
                  <h3>{"Time Filtering Node"}</h3>
                </Col>
              </Row>
              <div style={{minWidth:"15em"}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                </LocalizationProvider>
                <br/>
                <Button
                  type='submit'
                  className='w-100 mb-2'
                  onClick={async () => {
                    if(!operation) {
                      setErrorMessage('No operation was found selected');
                      return;
                    }
                    await operation.setSettings([lowerBound, upperBound]);
                    await operation.retriggerOperationChainForward();
                    await operation.getDisplayableData().then((res) => {
                      setEntries(res.entries);
                    });
                  }}            >
                  Apply Operation
                </Button>
                <br />
                <p>Entries out: {entries}</p>
              </div>

            </Col>
          </>

          <p>{errorMessage}</p>
        </Col>
      </Row>
    </Container>
  );
}
