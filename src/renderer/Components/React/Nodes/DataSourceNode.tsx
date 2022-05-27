import { useEffect } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import '../../Sass/DataSourceNode.scss';
import { Button } from 'react-bootstrap';

type TProps = {
  data: any;
};

function DataSourceNode({ data }: TProps) {
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="text-updater-node">
      <div>
        <Button>Data Source</Button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </div>
  );
}

export default DataSourceNode;
