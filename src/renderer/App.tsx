import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { socket, SocketContext } from './context/socket';
import VastChallengeOneView from './Components/React/VastChallenge1/VastChallengeOneView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChainControllerContext } from './context/broker';
import DataOperationChainControllerProxy from '../shared/datatools/DataOperationChainControllerProxy';
import IpcRendererImpl from './DataHandling/IpcRendereImpl';
import ChainControllerErrorLogger from '../shared/datatools/ChainControllerErrorLogger';

export default function App() {

  return (
    <SocketContext.Provider value={socket}>
      <ChainControllerContext.Provider
        value={
          new ChainControllerErrorLogger(
            new DataOperationChainControllerProxy(new IpcRendererImpl())
          )
        }
      >
        <Router>
          <Routes>
            <Route path="/" element={<VastChallengeOneView />} />
          </Routes>
        </Router>
      </ChainControllerContext.Provider>
    </SocketContext.Provider>
  );
}
