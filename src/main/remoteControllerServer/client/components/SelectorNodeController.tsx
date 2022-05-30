import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useContext } from 'react';
import { SocketContext } from '../../../../renderer/context/socket';
import { RemoteSocketContext } from '../context/socket';
import { TableNames } from '../../../../shared/Constants';

export default function SelectorNodeController(): JSX.Element {
  const [PersonId, setPersonId] = React.useState<number>();
  const [SelectedTable, setSelectedTable] = React.useState(TableNames.TEST);
  const socket = useContext(RemoteSocketContext);
  socket.on('connect', () => {
    console.log('connected');

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
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
