///<reference types="webpack-env" />

import RemoteApp from './RemoteApp';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const element = document.getElementById('root');
if (element) {
  createRoot(
    element
  ).render(<BrowserRouter>
    <RemoteApp />
  </BrowserRouter>);
} else {
  console.error('Could not find element with id "root"');
}
