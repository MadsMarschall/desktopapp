import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import React from 'react';
import Index from './RemoteUI/src';


const PORT = process.env.REMOTE_PORT || 1337;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

export default class ExpressServer {
  constructor() {
    this.init();
  }

  init() {
    app.use(express.static(path.resolve(__dirname, './RemoteUI/public/')));

    app.get('*', (req, res) => {
      const html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url}>
          <Index />
        </StaticRouter>
      );
      res.send(`<!DOCTYPE html>${html}`);
    });
    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }
}
