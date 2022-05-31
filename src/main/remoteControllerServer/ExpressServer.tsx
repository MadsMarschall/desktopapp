import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import express from 'express';
import http, { ServerOptions } from 'http';
import https from 'https';
import { Server } from 'socket.io';
import React from 'react';
import RemoteApp from './client/RemoteApp';
import multicastdns from 'multicast-dns';
import fs from 'fs';
import webpack from 'webpack';
import webpackConfigClient from './webpack.client';
import httpProxy from 'http-proxy';
import cors from 'cors';

const PROXY_PORT = process.env.PROXY_PORT || 1337;
const HTTP_PORT = process.env.REMOTE_PORT || 80;
const HTTPS_PORT = process.env.REMOTE_HTTPS_PORT || 443;

const { createProxyMiddleware } = require('http-proxy-middleware');

const httpServer80 = http.createServer();


const httpsApp = express();
const httpsServer443 = https.createServer({
  key: fs.readFileSync(path.resolve(__dirname, '../../../certs/selfsigned.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../../certs/selfsigned.crt')),
  requestCert: false,
  rejectUnauthorized: false,
}, httpsApp);

const app = express();
const server = http.createServer(app);



const io = new Server(server);
const mdns = multicastdns();



export default class ExpressServer {
  private proxyServer = httpProxy.createProxyServer();

  constructor() {
    this.init();
  }

  init() {
    const apiProxy = httpProxy.createProxyServer(
      {
        target: `http://localhost:${PROXY_PORT}`,
        changeOrigin: true,
        ws: true,
      },
    );
    const proxyServer = http.createServer(function(req, res) {
      apiProxy.web(req, res, { target: 'http://localhost:' + PROXY_PORT });
    });
    proxyServer.on('upgrade', function (req, socket, head) {
      apiProxy.ws(req, socket, head);
    });

    proxyServer.listen(HTTP_PORT);


    this.setupMulticastService();
    this.webpackServerInit();
    this.setupExpress();
    this.socketInit();

    /*server.listen(SERVER_PORT, () => {
      console.log(`Server is listening on port ${SERVER_PORT}`);
    });

     */
    server.listen(PROXY_PORT, () => {
      console.log(`Server is listening on port ${PROXY_PORT}`);
    });
  }
  private setupExpress(){
    var corsOptions = {
      origin: "settings-controller.local",
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    httpsApp.use(cors(corsOptions));
    app.use(cors(corsOptions));


    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'server/views'));

    app.use(express.static(path.resolve(__dirname, './dist/static')));

    const manifest = fs.readFileSync(
      path.join(__dirname, 'dist/static/manifest.json'),
      'utf-8'
    );
    const assets = JSON.parse(manifest);

    app.get('*', (req, res) => {

      const component = ReactDOMServer.renderToString(<StaticRouter location={req.url}><RemoteApp /></StaticRouter>);
      res.setHeader('Content-Type', 'text/html');
      //res.send("<!DOCTYPE html>" + html);
      res.render('client', { assets, component });
    });
  }

  public socketInit() {
    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  public getSocket() {
    return io;
  }

  public webpackServerInit() {
    const compiler = webpack([
      {
        ...webpackConfigClient,
        mode: 'development',
        devtool: 'source-map',
        output: {
          ...webpackConfigClient.output,
          filename: '[name].js'
        }
      }
    ]);
    /*
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        return;
      }
      if(!stats) {
        console.error("No stats");
        return;
      }
      const info = stats.toJson();
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    });
     */
    const watching = compiler.watch({}, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        return;
      }
      if (!stats) {
        console.error('No stats');
        return;
      }
      const info = stats.toJson();
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      if (stats) {
        console.log(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }));
      }
    });
  }

  private setupMulticastService() {
    mdns.on('warning', function(err) {
      console.log(err.stack);
    });

    mdns.on('response', function(response) {
      //console.log('got a response packet:', response);
    });

    mdns.on('query', (query) => {
      //console.log("got a query packet:", query);

      // iterate over all questions to check if we should respond
      query.questions.forEach((q) => {
        if (q.type === 'A' && q.name === 'settings-controller.local') {
          // send an A-record response for example.local
          console.log('responding to query for settings-controller.local');
          mdns.respond({
              answers: [{
                name: 'settings-controller.local',
                type: 'A',
                ttl: 300,
                data: '192.168.1.140'
              }]
            }
          );
        }
      });
    });
  }
}
