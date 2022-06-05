import SSRProvider from 'react-bootstrap/SSRProvider';
import { Route, Routes } from 'react-router-dom';
import { remoteSocket, RemoteSocketContext } from './context/socket';
import SelectorNodeController from './components/SelectorNodeController';
import IpcRemoteSocket from './tools/IpcRemoteSocket';
import { IpcSocketContext } from './context/ipcsocket';
import { RemoteUrls } from '../../../shared/Constants';
import DBScanClusteringController from './components/DBScanClusteringController';
import TimeFilteringController from './components/TimeFilteringController';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import momentTimezone from 'moment-timezone';
import { LocalizationProvider } from '@mui/x-date-pickers';
import SelectByTimeAndDayController from './components/SelectByTimeAndDayController';

export default function RemoteApp() {
  const timeZoneFromServer = "CST/CDT";
  const { moment } = new AdapterMoment({ instance: momentTimezone });
  const dateWithTimeZone = moment().tz(timeZoneFromServer);
  return (
        <SSRProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>

          <RemoteSocketContext.Provider value={remoteSocket}>
            <IpcSocketContext.Provider value={new IpcRemoteSocket(remoteSocket)}>

            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route
                path={RemoteUrls.SELECTOR_NODE}
                element={<SelectorNodeController />}
              />
              <Route
                path={RemoteUrls.DBSCAN_NODE}
                element={<DBScanClusteringController />}
              />
              <Route
                path={RemoteUrls.TIME_FILTERING}
                element={<TimeFilteringController />}
              />
              <Route
                path={RemoteUrls.SELECT_BY_TIME_AND_DAY}
                element={<SelectByTimeAndDayController />}
              />
            </Routes>
          </IpcSocketContext.Provider>
          </RemoteSocketContext.Provider>
          </LocalizationProvider>
        </SSRProvider>
  );
}
