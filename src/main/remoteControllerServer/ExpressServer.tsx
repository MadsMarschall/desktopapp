import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import React from 'react';
import RemoteApp from './client/RemoteApp';


const PORT = process.env.REMOTE_PORT || 1337;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
import webpack from 'webpack';
import webpackConfigClient from './webpack.client';
import fs from 'fs';

export default class ExpressServer {
  constructor() {
    this.init();
  }

  init() {
    const compiler = webpack([
      {
        ...webpackConfigClient,
        mode: "development",
        devtool: "source-map",
        output: {
          ...webpackConfigClient.output,
          filename: "[name].js",
        },
      },
    ]);

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
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "server/views"));

    app.use(express.static(path.resolve(__dirname, './dist/static')));

    const manifest = fs.readFileSync(
      path.join(__dirname, "dist/static/manifest.json"),
      "utf-8"
    );
    const assets = JSON.parse(manifest);

    app.get('*', (req, res) => {
      const component = ReactDOMServer.renderToString(<StaticRouter location={req.url}><RemoteApp /></StaticRouter>);
      res.setHeader('Content-Type', 'text/html');
      //res.send("<!DOCTYPE html>" + html);
      res.render("client", { assets, component });
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
