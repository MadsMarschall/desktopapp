import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Handle, Position } from 'react-flow-renderer';

import QRCode from 'react-qr-code';
import { handleSourceNodeConnection, listenForMethods } from '../../../DataHandling/dataUtilityFunctions';
import { Methods, OperationIds, PHONE_CONTROLLER_BASE_URL, RemoteUrls, TableNames } from '../../../../shared/Constants';
import { ChainControllerContext } from '../../../context/broker';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import { DateTimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import SelectByTimeComponent from '../helperComponents/SelectByTimeComponent';

type IProps = {
  data: {
    id: string;
    label: string;
  };
};


export default function SelectByTimeNode({ data }: IProps) {
  const [lowerBound, setLowerBound] = React.useState<Date>(new Date('2014-06-06 08:00:00'));
  const [upperBound, setUpperBound] = React.useState<Date>(new Date('2014-06-08 23:59:59'));
  const [entriesLoaded, setEntriesLoaded] = useState<number>(0);
  const [operation, setOperation] = useState<IDataOperation>();
  const dataOperationChainControllerProxy = useContext(ChainControllerContext);

  function onMount() {
    dataOperationChainControllerProxy.createOperationNode(
      OperationIds.SELECT_BY_TIME_AND_DAY,
      data.id
    ).then(async (operation) => {
      await operation.setSettings(
        [lowerBound,
          upperBound
        ]
      );
      listenForMethods(data.id, [Methods.DATA_OPERATION_RETRIGGER_OPERATION_CHAIN_FORWARD], (data) => {
        operation.getDisplayableData().then((data) => {
          setEntriesLoaded(data.entries);
        });
      });

      listenForMethods(data.id, [Methods.DATA_OPERATION_SET_SETTINGS], (data) => {
        if (!operation) {
          console.log('Operation not found');
          return;
        }
        operation.getSettings().then((settings: any[]) => {
          console.log(settings);
          if (!settings || settings.length === 0) {
            console.log('No settings found');
            return;
          }
          setLowerBound(settings[0]);
          setUpperBound(settings[1]);

          console.log('settings', settings);
        });
      });
      setOperation(operation);
    });
  }

  useEffect(onMount, []);

  const d = data;

  const handleClick = async () => {
    if (!operation) return;
    operation.setSettings([lowerBound.valueOf(), upperBound.valueOf()]).then(() => {
      operation.retriggerOperationChainForward().then(() => {
        operation.getDisplayableData().then((metaData) => {
          setEntriesLoaded(metaData.entries);
        });
      });
    })
  };

  return (
    <div className='selectorNode'>
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
            <div style={{ background: 'white', padding: '16px' }}>
              {/* @ts-ignore */}
              <QRCode
                value={`${PHONE_CONTROLLER_BASE_URL}${RemoteUrls.SELECT_BY_TIME_AND_DAY}?nodeId=${data.id}`}
              />
            </div>
          </Col>
          <Col>
            <SelectByTimeComponent value={upperBound} onChange={(newValue) => {
              if (newValue) setUpperBound(newValue);
            }} renderInput={(params) => <TextField {...params} />} value1={lowerBound} onChange1={(newValue) => {
              if (newValue) setLowerBound(newValue);
            }} onClick={handleClick} entriesLoaded={entriesLoaded} />
          </Col>
        </Row>
      </div>
    </div>
  )
    ;
}
