import React, { DragEventHandler } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Container fluid className="w-100">
      <Row>
        <Col xs={12}>
          <div className='p-2 m-2 description'>
            <h2> Drag and drop nodes to use them</h2>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'map')}
             draggable
        >
          Map Node
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'selector')}
             draggable
        >
          Selector by Person Id
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'selectByDay')}
             draggable
        >
          Select by Day Node
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'dbScanClustering')}
             draggable
        >
          DBScan Clustering Node
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'timeFiltering')}
             draggable
        >
          Time Filtering Node
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'clusterMap')}
             draggable
        >
          Cluster Map Node
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'querySpecific')}
             draggable
        >
          Query Specific from DB
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'selectByDayAndTime')}
             draggable
        >
          Select by Time Node
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'dummyNode1')}
             draggable
        >
          d1
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'dummyNode2')}
             draggable
        >
          d2
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'dummyNode3')}
             draggable
        >
          d3
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'dummyNode4')}
             draggable
        >
          d4
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'dummyNode5')}
             draggable
        >
          d5
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'groupByThreshold')}
             draggable
        >
          Group From Matrix Node
        </Col>
        <Col xs={6} md={3} lg={2}
             className='text-center bg-light p-2 m-2 node'
             onDragStart={(event: any) => onDragStart(event, 'displayGroupRideStatistics')}
             draggable
        >
          Display Group Ride Statistics Node
        </Col>


      </Row>

    </Container>
  );
};
