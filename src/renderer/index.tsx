import { createRoot } from 'react-dom/client';
import App from './App';
import { Channels } from '../main/preload';


const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
