import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
import { RemoteSocketContext } from '../context/socket';
import { TableNames } from '../../../../shared/Constants';
import { IpcSocketContext } from '../context/ipcsocket';
import { useLocation } from 'react-router-dom';
import { ClientRequestor } from '../../../../shared/domain/ClientRequestor';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import DataOperationProxy from '../../../../shared/datatools/DataOperationProxy';

export default function SelectorNodeController(): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [PersonId, setPersonId] = React.useState<number>();
  const [SelectedTable, setSelectedTable] = React.useState(TableNames.TEST);
  const [operation, setOperation] = React.useState<IDataOperation>();
  const socket = useContext(RemoteSocketContext);
  const ipc = useContext<ClientRequestor>(IpcSocketContext);
  let query: URLSearchParams;
  function useQuery() {
    const {search} = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  useEffect(()=>{
    if(!operation) return;
    operation.setSettings([SelectedTable,PersonId]);
  },[PersonId,SelectedTable])
  query = useQuery();
  socket.on('connect',async () => {
    if (query.get('nodeId')){
      let operationTemp = new DataOperationProxy(query.get('nodeId') as string,ipc)
      setOperation(operationTemp);
      (await operationTemp.getSettings()).forEach((value,index)=>{
        if(index===0) setSelectedTable(value);
        if(index===1) setPersonId(value);
      })
      console.log(await operationTemp.getType(),"proxy");
    }
  });
  socket.on('disconnect', () => {
    setErrorMessage('Disconnected from server');
  });
  return (
    <Container>
      <Row>
        <Col className="pt-5">
          <h1>Selector node control</h1>
          <Form>
            <Form.Group>
              <Form.Label htmlFor="inputPassword5">Select Person</Form.Label>
              <Form.Control
                type="number"
                id="PersonIdSelection"
                placeholder="Type in PersonId"
                value={PersonId || ''}
                onChange={(e) => {
                  setPersonId(parseInt(e.target.value,10));
                }}
              />
              <Form.Select
                required
                className="mt-2"
                aria-label="Default select example"
                onChange={(e) => {
                  setSelectedTable(
                    parseInt(e.target.value,10) as unknown as TableNames
                  );
                }}
                value={SelectedTable}
              >
                <option>Please select day</option>
                <option value={TableNames.FRIDAY}>Friday</option>
                <option value={TableNames.SATURDAY}>Saturday</option>
                <option value={TableNames.SUNDAY}>Sunday</option>
              </Form.Select>
              <br/>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                size={'lg'}
                onClick={async () => {
                  if(!operation) {
                    setErrorMessage('No operation was found selected');
                    return;
                  }
                  await operation.setSettings([SelectedTable,PersonId]);
                  await operation.retriggerOperationChainForward();
                }}
              >Trigger</Button>
            </Form.Group>
          </Form>
          <p>{errorMessage}</p>
        </Col>
      </Row>
    </Container>
  );
}
