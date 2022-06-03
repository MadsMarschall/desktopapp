import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
import { RemoteSocketContext } from '../context/socket';
import { TableNames } from '../../../../shared/Constants';
import { IpcSocketContext } from '../context/ipcsocket';
import { useLocation } from 'react-router-dom';
import { ClientRequestor } from '../../../../shared/domain/ClientRequestor';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import DataOperationProxy from '../../../../shared/datatools/DataOperationProxy';

export default function DBScanClusteringController(): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [eps, setEps] = React.useState<number>();
  const [minPts, setMinPts] = React.useState<number>();
  const [useTimeEps, setUseTimeEps] = React.useState<boolean>(false);
  const [timeEps, setTimeEps] = React.useState<number>();
  const [entries, setEntries] = React.useState<any[]>([]);

  const [operation, setOperation] = React.useState<IDataOperation>();
  const socket = useContext(RemoteSocketContext);
  const ipc = useContext<ClientRequestor>(IpcSocketContext);
  let query: URLSearchParams;

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  useEffect(() => {
    if (!operation) return;
    operation.setSettings([eps, minPts , useTimeEps , timeEps ]);
  }, [eps, minPts, useTimeEps, timeEps, operation]);
  query = useQuery();
  socket.on('connect', async () => {
    if (query.get('nodeId')) {
      let operationTemp = new DataOperationProxy(query.get('nodeId') as string, ipc);
      setOperation(operationTemp);
      (await operationTemp.getSettings()).forEach((value, index) => {
        if (index === 0) setEps(value);
        if (index === 1) setMinPts(value);
        if (index === 2) setUseTimeEps(value);
        if (index === 3) setTimeEps(value);
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
            <Form.Group>
              <Form.Label htmlFor='inputPassword5'>Epsilon </Form.Label>
              <Form.Control
                type='number'
                id='PersonIdSelection'
                value={eps || ''}
                onChange={(e) => {
                  setEps(parseInt(e.target.value, 10));
                }}
              />
              <br />
              <Form.Label htmlFor='inputPassword5'>Minimum Points</Form.Label>

              <Form.Control
                type='number'
                id='PersonIdSelection'
                value={minPts || ''}
                onChange={(e) => {
                  setMinPts(parseInt(e.target.value, 10));
                }}
              />
              <br />

              <Form.Label htmlFor='inputPassword5'>Use Time Parameter</Form.Label>
              <Form.Check
                type='switch'
                id='custom-switch'
                label='Use time'
                checked={useTimeEps}
                onChange={(e) => {
                  setUseTimeEps(e.target.checked);
                }}
              />
              <br />
              <Form.Label htmlFor='inputPassword5'>Time Parameter</Form.Label>
              {useTimeEps && (
                <Form.Control
                  type='number'
                  id='PersonIdSelection'
                  value={timeEps || ''}
                  onChange={(e) => {
                    setTimeEps(parseInt(e.target.value, 10));
                  }}
                />
              )}
            </Form.Group>
            <br />
            <Button
              type='submit'
              className='w-100 mb-2'
              onClick={async () => {
                if(!operation) {
                  setErrorMessage('No operation was found selected');
                  return;
                }
                await operation.setSettings([eps, minPts, useTimeEps, timeEps]);
                await operation.retriggerOperationChainForward();
              }}            >
              Apply Operation
            </Button>
            <br />
            <p>Entries loaded: {entries}</p>
          </>

          <p>{errorMessage}</p>
        </Col>
      </Row>
    </Container>
  );
}
