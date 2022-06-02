import React from 'react';

export default () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div>
      <div
        className="node"
        onDragStart={(event) => onDragStart(event, 'dataSource')}
        draggable
      >
        Data Source Node
      </div>
      <div
        className="node"
        onDragStart={(event) => onDragStart(event, 'map')}
        draggable
      >
        Map Node
      </div>
      <div
        className="node"
        onDragStart={(event) => onDragStart(event, 'selector')}
        draggable
      >
        Selector Node
      </div>
      <div
        className="node"
        onDragStart={(event) => onDragStart(event, 'timeSlider')}
        draggable
      >
        Time Slider Node
      </div>
      <div
        className="node"
        onDragStart={(event) => onDragStart(event, 'timePlayer')}
        draggable
      >
        Time Player Node
      </div>
      <div
        className="node"
        onDragStart={(event) => onDragStart(event, 'selectByDay')}
        draggable
      >
        Select by Day Node
      </div>
    </aside>
  );
};
