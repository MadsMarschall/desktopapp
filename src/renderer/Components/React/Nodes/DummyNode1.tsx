import { Col, Form, Row, Table } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';


export default function DummyNode1({ data }: any) {
    return (
      <div className='DummyNode1'>
        <Handle type={'source'} position={Position.Right}>

        </Handle>
        <div className='p-5 bg-info' style={{maxWidth:"400px"}}>
          <Row>
            <Col>
              <h3>Load data by Day</h3>
              <label>Default select example:</label>
              <Form.Select aria-label="Default select example">
              <option>Saturday</option>
              </Form.Select>
              <br/>
              <Table striped bordered hover>
                <thead>
                <tr>
                  <th>timestamp</th>
                  <th>PersonId</th>
                  <th>type</th>
                  <th>X</th>
                  <th>Y</th>
                </tr>
                </thead>
              </Table>
              <p>Entries exported: 9078623</p>
            </Col>
          </Row>
        </div>
        <Handle
          type='target'
          position={Position.Left}
          id='b'
        />
      </div>
    );
  }
