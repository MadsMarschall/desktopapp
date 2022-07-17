import { Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';


export default function DummyNode2({ data }: any) {
    return (
      <div className='DummyNode2'>
        <Handle type={'source'} position={Position.Right}>

        </Handle>
        <div className='p-5 bg-info' style={{maxWidth:"400px"}}>
          <Row>
            <Col>
              <h3>Group by:</h3>
              <label>Select key to perform grouping</label>
              <Form.Select aria-label="Group by:">
              <option>PersonId</option>
              </Form.Select>
              <br/>
              <p>Entries exported: 9078623 <br/> Groups: 6411</p>
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
