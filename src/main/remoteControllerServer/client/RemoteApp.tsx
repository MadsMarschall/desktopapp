import SSRProvider from 'react-bootstrap/SSRProvider';
import { Route, Routes } from 'react-router-dom';
import { remoteSocket, RemoteSocketContext } from './context/socket';
import SelectorNodeController from './components/SelectorNodeController';

export default function RemoteApp() {
  return (
        <SSRProvider>
          <RemoteSocketContext.Provider value={remoteSocket}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route
                path="/selector-node-controller"
                element={<SelectorNodeController />}
              />
            </Routes>
          </RemoteSocketContext.Provider>
        </SSRProvider>
  );
}
