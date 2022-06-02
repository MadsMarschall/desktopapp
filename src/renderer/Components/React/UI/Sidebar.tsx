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
    <Container >
      <Row>
        <Col xs={12}>
          <div className="p-2 m-2 description">
           <h2> Drag and drop nodes to use them</h2>
          </div>
        </Col>
      </Row>
      <Row>


      <Col xs={3}
        className="bg-light p-2 m-2 dndnode input"
        onDragStart={(event:any) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 dndnode"
        onDragStart={(event:any) => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 dndnode output"
        onDragStart={(event:any) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 node"
        onDragStart={(event:any) => onDragStart(event, 'dataSource')}
        draggable
      >
        Data Source Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 node"
        onDragStart={(event:any) => onDragStart(event, 'map')}
        draggable
      >
        Map Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 node"
        onDragStart={(event:any) => onDragStart(event, 'selector')}
        draggable
      >
        Selector Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 node"
        onDragStart={(event:any) => onDragStart(event, 'timeSlider')}
        draggable
      >
        Time Slider Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 node"
        onDragStart={(event:any) => onDragStart(event, 'timePlayer')}
        draggable
      >
        Time Player Node
      </Col>
      <Col xs={3}
        className="bg-light p-2 m-2 node"
        onDragStart={(event:any) => onDragStart(event, 'selectByDay')}
        draggable
      >
        Select by Day Node
      </Col>
      </Row>
    </Container>
  );
};
