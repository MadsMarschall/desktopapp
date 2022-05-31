import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import express from 'express';
import http, { ServerOptions } from 'https';
import { Server } from 'socket.io';
import React from 'react';
import RemoteApp from './client/RemoteApp';
import multicastdns from 'multicast-dns';
import fs from 'fs';
import webpack from 'webpack';
import webpackConfigClient from './webpack.client';
import httpProxy from 'http-proxy';

const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const httpServer80 = express();
const server = http.createServer(app);
const io = new Server(server);
const mdns = multicastdns();


const SERVER_PORT = process.env.REMOTE_PORT || 1337;

export default class ExpressServer {
  private proxyServer = httpProxy.createProxyServer();

  constructor() {
    debugger
    this.init();
  }

  init() {
    this.setupMulticastService();
    this.webpackServerInit();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'server/views'));

    app.use(express.static(path.resolve(__dirname, './dist/static')));

    app.use(function(req, res, next){
      req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
      next()
    })
    const manifest = fs.readFileSync(
      path.join(__dirname, 'dist/static/manifest.json'),
      'utf-8'
    );
    const assets = JSON.parse(manifest);

    app.get('/', (req, res) => {

      const component = ReactDOMServer.renderToString(<StaticRouter location={req.url}><RemoteApp /></StaticRouter>);
      res.setHeader('Content-Type', 'text/html');
      //res.send("<!DOCTYPE html>" + html);
      res.render('client', { assets, component });
    });
    this.socketInit();

    server.listen(SERVER_PORT, () => {
      console.log(`Server is listening on port ${SERVER_PORT}`);
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

  private setupProxy(app: express.Application) {
    const { loggerPlugin } = require('http-proxy-middleware');

    app.use('*',
      createProxyMiddleware({
        target: 'http://settings-controller.local',
        changeOrigin: true,
        router: {
          '/': 'http://localhost:80'
        }
      })
    );
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
