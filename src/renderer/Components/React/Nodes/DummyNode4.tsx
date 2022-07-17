import { Col, Form, Row, Table } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import { TimePicker } from '@mui/x-date-pickers';


export default function DummyNode4({ data }: any) {
    return (
      <div className='DummyNode4'>
        <Handle type={'source'} position={Position.Right}>

        </Handle>
        <div className='p-5 bg-info' style={{maxWidth:"400px"}}>
          <Row>
            <Col>
              <h3>Mapping Trajectories to Ride information</h3>
              <label>Distance to ride threshhold</label>
              <Form.Select aria-label="Distance to ride threshhold">
                <option>50 meters</option>
              </Form.Select>
              <label>Select check-in time threshold</label>
              <Form.Select aria-label="Time threshhold">
                <option>5 minutes</option>
              </Form.Select>
              <label>Simplify data to time interval</label>
              <Form.Select aria-label="Time interval">
                <option>5 minutes</option>
              </Form.Select>
              <br/>
              <p>
                Timestamps mapped by selected interval in array covering the period 8:00 to 24:00. <br/>
                periods when persons are not in the park arr marked with type = "out-of-park" and rideId=-99. Therefore all trajectory arrays have same length, and the length is dependent on the selected time threshold/interval.
              </p>
              <p>Entries exported: 1230912</p>
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
