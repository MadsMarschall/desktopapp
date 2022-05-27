import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { socket, SocketContext } from './context/socket';
import VastChallengeOneView from './Components/React/VastChallenge1/VastChallengeOneView';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path="/" element={<VastChallengeOneView />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
}
