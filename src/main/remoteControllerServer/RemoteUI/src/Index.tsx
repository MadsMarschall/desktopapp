import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { hydrate } from 'react-dom';
import { useEffect } from 'react';
import RemoteApp from './RemoteApp';

export default function Index() {
  return (
    <BrowserRouter>
      <RemoteApp />
    </BrowserRouter>
  );
}

if (typeof document === "undefined") {
} else {
  ReactDOM.hydrate(SSR, document.getElementById("app"));
}
