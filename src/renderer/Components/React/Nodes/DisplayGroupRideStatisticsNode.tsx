import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';
import ReactApexChart from 'react-apexcharts';
import Apex from 'apexcharts';
import {
  handleSourceNodeConnection,
  handleTargetNodeConnection,
  listenForMethods
} from '../../../DataHandling/dataUtilityFunctions';
import {
  IPCEvents,
  Methods,
  OperationIds,
  PHONE_CONTROLLER_BASE_URL,
  RemoteUrls,
  TableNames
} from '../../../../shared/Constants';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { ApexOptions } from 'apexcharts';

type IProps = {
  data: {
    id: string;
    label: string;
  };
};

export default function DisplayGroupRideStatisticsNode({ data }: IProps) {
  const [operation, setOperation] = useState<IDataOperation>();
  const [seriesData, setSeriesData] = useState<any[]>([0,0,0,0]);
  const [labels, setLabels] = useState<string[]>(["0", "1", "2", "3"]);
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  useEffect(() => {
    Apex.exec('rideChart', 'updateSeries', [{
      data: seriesData
    }])
    console.log(seriesData);
  }, [seriesData]);

    let series = [{
      data: seriesData
    }]
    let options:ApexOptions = {
      chart: {
        id:"rideChart",
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val+"";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: labels,
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }

      },
      title: {
        text: 'Rides',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    }

function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.DISPLAY_GROUP_RIDE_STATISTICS,
      data.id
    ).then(async (operation) => {

      window.electron.ipcRenderer.on(IPCEvents.UPDATE,
        (event:any, data:any) => {
          operation.getDisplayableData().then((data) => {
            if(!data.rideDataStatistics) return;
            setSeriesData(data.rideDataStatistics.map((stat) => stat.countOfRideEntries));
            setLabels(data.rideDataStatistics.map((stat) => "Ride " + stat.rideId));
          });
        }
      );
      setOperation(operation);
    });

  }

  useEffect(onMount, []);

  return (
    <div className='displayGroupRideStatistics'>
      <Handle
        type='source'
        position={Position.Right}
        id='b'
        onConnect={async (params) => {
          handleSourceNodeConnection(
            params,
            await dataOperationChainControllerProxy.getOperationByNodeId(
              data.id
            )
          );
        }}
      />
      <div>
        <Row className='bg-info p-4 m-4'>
          <Col>
            <ReactApexChart options={options} series={series} type="bar" height={600} width={1200}/>
          </Col>
        </Row>
      </div>
      <Handle
        type='target'
        position={Position.Left}
        id='b'
        onConnect={async (params) => {
          handleTargetNodeConnection(
            params,
            await dataOperationChainControllerProxy.getOperationByNodeId(
              data.id
            )
          );
        }}
      />
    </div>
  );
}
