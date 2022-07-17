import { Col, Form, Row, Table } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import { TimePicker } from '@mui/x-date-pickers';


export default function DummyNode5({ data }: any) {
    return (
      <div className='DummyNode5'>
        <Handle type={'source'} position={Position.Right}>

        </Handle>
        <div className='p-5 bg-info' style={{maxWidth:"400px"}}>
          <Row>
            <Col>
              <h3>Create pairwise distance matrix from vistor paths</h3>
              <label>Select trajectory distance calculation method</label>
              <Form.Select aria-label="Select trajectory distance calculation method">
                <option>Edit Distance (Levenshtein)</option>
              </Form.Select>
              <p>Exported Matrix size: 6411*6411</p>
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
