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
import { v4 as uuidv4 } from 'uuid';

type IProps = {
  data: {
    id: string;
    label: string;
  };
};

const chartId = 'chart_'+uuidv4();

export default function DisplayGroupRideStatisticsNode({ data }: IProps) {
  const [operation, setOperation] = useState<IDataOperation>();
  const [seriesData, setSeriesData] = useState<any[]>([0,0,0,0]);
  const [labels, setLabels] = useState<string[]>(["0", "1", "2", "3"]);
  const [colors, setColors] = useState<string[]>(["#008FFB", "#00E396", "#FEB019", "#FF4560"]);
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  useEffect(() => {
    Apex.exec(chartId, 'updateSeries', [{
      data: seriesData
    }])
  }, [seriesData]);

    let series = [{
      data: seriesData,
    }]
    let options:ApexOptions = {
      chart: {
        id:chartId,
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
          fontWeight: 'normal',
          colors: ["#000000", "#00E396", "#FEB019", "#FF4560"]
        },
      },
      xaxis: {
        categories: labels,
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: '',
            gradient: {
              colorFrom: '#203d5e',
              colorTo: '#244c73',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        },
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
            let rideDataStatistics = data.rideDataStatistics.sort((a, b) => {return   a.rideId -b.rideId});
            console.log(rideDataStatistics);
            setSeriesData(rideDataStatistics.map((stat) => stat.countOfRideEntries));
            setLabels(rideDataStatistics.map((stat) => "Ride " + stat.rideId + " "+ stat.type));
            setColors(rideDataStatistics.map((stat) => stat.color? stat.color : "#000000"));
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
        <Row className='bg-info' >
          <Col >
            <ReactApexChart options={options} series={series} type="bar" height={600} width={2400} className='p-4 m-4'/>
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
