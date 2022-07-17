import { Col, Form, Row, Table } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';


export default function DummyNode3({ data }: any) {
    return (
      <div className='DummyNode3'>
        <Handle type={'source'} position={Position.Right}>

        </Handle>
        <div className='p-5 bg-info' style={{maxWidth:"800px"}}>
          <Row>
            <Col>
              <h3>Load ride data</h3>
              <Table striped bordered hover>
                <thead>
                <tr>
                  <th>parkguide</th>
                  <th>realWorldType</th>
                  <th>dinofunWorldName</th>
                  <th>X</th>
                  <th>Y</th>
                  <th>type</th>
                </tr>
                </thead>
              </Table>
              <p>Entries exported: 71</p>
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
