import SSRProvider from 'react-bootstrap/SSRProvider';
import { Route, Routes } from 'react-router-dom';
import { remoteSocket, RemoteSocketContext } from './context/socket';
import SelectorNodeController from './components/SelectorNodeController';

export default function RemoteApp() {
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <head>
        <title>Server Rendered App</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossOrigin="anonymous"
        />
      </head>
      <body>
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
        <script src="./bundle.js" />
      </body>
    </html>
  );
}
