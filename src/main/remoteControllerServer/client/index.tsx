///<reference types="webpack-env" />

import RemoteApp from './RemoteApp';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const element = document.getElementById('root');
if(element) {
    hydrateRoot(
      element,
        <BrowserRouter>
            <RemoteApp />
        </BrowserRouter>
    );
} else {
   console.error('Could not find element with id "root"');
}
