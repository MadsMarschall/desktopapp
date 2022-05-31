import SSRProvider from 'react-bootstrap/SSRProvider';
import { Route, Routes } from 'react-router-dom';
import { remoteSocket, RemoteSocketContext } from './context/socket';
import SelectorNodeController from './components/SelectorNodeController';
import IpcRemoteSocket from './tools/IpcRemoteSocket';
import { IpcSocketContext } from './context/ipcsocket';

export default function RemoteApp() {
  return (
        <SSRProvider>
          <RemoteSocketContext.Provider value={remoteSocket}>
            <IpcSocketContext.Provider value={new IpcRemoteSocket(remoteSocket)}>

            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route
                path="/selector-node-controller"
                element={<SelectorNodeController />}
              />
            </Routes>
          </IpcSocketContext.Provider>
          </RemoteSocketContext.Provider>
        </SSRProvider>
  );
}
