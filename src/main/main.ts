/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./client/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import dotenv from 'dotenv';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { Channels } from './preload';
import DataOperationInvoker from './datahandling/invokers/DataOperationInvoker';
import DataOperationChainController from './datahandling/datacontrolling/DataOperationChainController';
import DataOperationChainControllerInvoker from './datahandling/invokers/DataOperationChainControllerInvoker';
import { Methods } from '../shared/Constants';
import ExpressServer from './remoteControllerServer/ExpressServer';
import ChainControllerLoggerDecorator from './datahandling/datacontrolling/decorators/ChainControllerLoggerDecorator';
import { reject } from 'lodash';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
// EXPRESS STUFF
const expressServer = new ExpressServer();

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
const dataOperationChainController = new ChainControllerLoggerDecorator(new DataOperationChainController());
const dataOperationInvoker = new DataOperationInvoker(
  dataOperationChainController
);
const chainControllerInvoker = new DataOperationChainControllerInvoker(
  dataOperationChainController
);

ipcMain.handle(
  <Channels>'ipc-chain-controller',
  async (event, id: string, method: Methods, args: unknown[]) => {
    return chainControllerInvoker.handleRequest('SINGLETON', method, ...args);
  }
);
ipcMain.handle(
  <Channels>'ipc-data-operation',
  async (event, id: string, method: Methods, args: unknown[]) => {
    return dataOperationInvoker.handleRequest(id, method, ...args);
  }
);

const io = expressServer.getSocket();
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on(<Channels>'ipc-chain-controller', async (id: string, method: Methods, args: unknown[], callback: (result: unknown) => unknown) => {
    if (!method) return;
    if (!id) return;
    if (!args) return;
    const result = await chainControllerInvoker.handleRequest('SINGLETON', method, ...args);
    callback(result);
  });
  socket.on(<Channels>'ipc-data-operation', async (id: string, method: Methods, args: unknown[], callback: (result: unknown) => unknown) => {
    if (!method) return;
    if (!id) return;
    if (!args) return;
    const result = await dataOperationInvoker.handleRequest(id, method, ...args);
    callback(result);
  });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
