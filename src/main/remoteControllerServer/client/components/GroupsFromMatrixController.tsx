import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
import { groupBy as rowGrouper } from 'lodash';
import { RemoteSocketContext } from '../context/socket';
import { Methods, TableNames } from '../../../../shared/Constants';
import { IpcSocketContext } from '../context/ipcsocket';
import { useLocation } from 'react-router-dom';
import { ClientRequestor } from '../../../../shared/domain/ClientRequestor';
import IDataOperation from '../../../../shared/domain/IDataOperation';
import DataOperationProxy from '../../../../shared/datatools/DataOperationProxy';
import DataGrid, { Column, SelectColumn, SortColumn } from 'react-data-grid';
import { listenForMethods } from '../../../../renderer/DataHandling/dataUtilityFunctions';
import { Comparator } from '@tidyjs/tidy';
import { css } from '@emotion/react';
import { IRow } from '../../../../shared/domain/Interfaces';

const groupingClassname  = css`
    display: flex;
    flex-direction: column;
    block-size: 100%;
    gap: 8px;
    > .rdg {
      flex: 1;
    }
`;
const optionsClassname = css`
  display: flex;
  gap: 8px;
  text-transform: capitalize;
`;

const columns: readonly Column<IRow>[] = [
  SelectColumn,
  { key: 'groupId', name: 'Group ID' },
  { key: 'members', name: 'Members' },
  { key: 'numberOfMembers', name: 'Number of Members' }
];

function rowKeyGetter(row: any) {
  return row.groupId;
}

export default function GroupsFromMatrixController(): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [threshold, setThreshold] = React.useState<string>('');
  const [numberOfGroups, setNumberOfGroups] = React.useState<number>();
  const [operation, setOperation] = React.useState<IDataOperation>();
  const [rows, setRows] = React.useState<any[]>([]);
  const [sortColumns, setSortColumns] = React.useState<readonly SortColumn[]>([]);
  const [selectedOptions, setSelectedOptions] = React.useState<readonly string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<number>>(() => new Set());
  const [exportedRows, setExportedRows] = React.useState<any[]>([]);
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(
    () => new Set<unknown>(['United States of America', 'United States of America__2015'])
  );

  const options = ['numberOfMembers'];


  const socket = useContext(RemoteSocketContext);
  const ipc = useContext<ClientRequestor>(IpcSocketContext);
  let query: URLSearchParams;

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  function getComparator(sortColumn: string): Comparator<any> {
    switch (sortColumn) {
      case 'members':
        return (a:any, b:any) => {
          return a[sortColumn].localeCompare(b[sortColumn]);
        };
      case 'groupId':
      case 'numberOfMembers':
        return (a:any, b:any) => {
          return a[sortColumn] - b[sortColumn];
        };

      default:
        throw new Error(`unsupported sortColumn: "${sortColumn}"`);
    }
  }

  useEffect(() => {
    let exportedRows: any[] = [];
    rows.forEach(row => {
      if(selectedRows.has(row.groupId)) {
        exportedRows.push(row);
      }
    })
    setExportedRows(exportedRows);
    operation?.setSettings([parseInt(threshold),exportedRows]);
  }, [selectedRows]);

  const sortedRows = React.useMemo((): readonly any[] => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [rows, sortColumns]);


  function toggleOption(option: string, enabled: boolean) {
    const index = selectedOptions.indexOf(option);
    if (enabled) {
      if (index === -1) {
        setSelectedOptions((options) => [...options, option]);
      }
    } else if (index !== -1) {
      setSelectedOptions((options) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        return newOptions;
      });
    }
    setExpandedGroupIds(new Set());
  }

  useEffect(() => {
    if (!operation) return;
    operation.setSettings([parseInt(threshold),exportedRows]);
  }, [threshold]);


  query = useQuery();
  socket.on('connect', async () => {
    console.log('connected');
    if (query.get('nodeId')) {
      let operationTemp = new DataOperationProxy(query.get('nodeId') as string, ipc);
      setOperation(operationTemp);
      await operationTemp.getSettings().then((res) => {
        setThreshold(res[0]);
      });
      console.log(await operationTemp.getType(), 'proxy');
    }
  });
  socket.on('disconnect', () => {
    setErrorMessage('Disconnected from server');
  });
  return (
    <Container>
      <Row>
        <Col>

          <Row>
            <Col>
              <br/>
              <h3>{'Cluster groups from matrix'}</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  type={'number'}
                  placeholder="Type in threshold"
                  aria-label="Threshold"
                  aria-describedby="basic-addon2"
                  value={threshold}                  onChange={(e) => {
                   setThreshold(e.target.value);
                  }}
                />

                <Button variant="outline-secondary" id="button-addon2"
                        onClick={async () => {
                          if (!operation) {
                            setErrorMessage('No operation was found selected');
                            return;
                          }
                          await operation.setSettings([parseInt(threshold),exportedRows]);
                          await operation.retriggerOperationChainForward();
                          await operation.getDisplayableData().then((res) => {
                            if(!res.groups) return;
                            setRows(res.groups);
                            setNumberOfGroups(res.groups?.length);
                          });
                        }}>
                  Apply Threshold
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <br />
          <p>Groups exported: {numberOfGroups}</p>
          <p>{errorMessage}</p>
        </Col>
        <Row>

            <b>Group by columns:</b>
            <div>
              {options.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={(event) => toggleOption(option, event.target.checked)}
                  />{' '}
                  {option}
                </label>
              ))}
            </div>
        </Row>
        <Row>
          <Col>
            <DataGrid
              rows={sortedRows}
              rowKeyGetter={rowKeyGetter}
              selectedRows={selectedRows}
              columns={columns}
              defaultColumnOptions={{
                sortable: true,
                resizable: true
              }}
              groupBy={selectedOptions}
              onSelectedRowsChange={setSelectedRows}
              onExpandedGroupIdsChange={setExpandedGroupIds}
              expandedGroupIds={expandedGroupIds}
              rowGrouper={rowGrouper}
              sortColumns={sortColumns}
              onSortColumnsChange={setSortColumns}
              onRowsChange={setRows}
              className="fill-grid"
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <p>Number of groups selected: {selectedRows.size}</p>
          </Col>
        </Row>
      </Row>
    </Container>
  );
}
