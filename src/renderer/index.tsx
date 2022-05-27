import { createRoot } from 'react-dom/client';
import App from './App';
import { Channels } from '../main/preload';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage("ipc-data-operation" as Channels, ['ping']);
