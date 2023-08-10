/**
 * electron 主入口文件
 */
import { app } from 'electron';
import AppWindow from './app-window';
import setMenus from './set-menu';
import isDev from 'electron-is-dev';
import initIpcMainHandle from './preload/handle';
import setTray from './set-tray';
import setDock from './set-dock';

app.whenReady().then(() => {
  initIpcMainHandle();
  const win = new AppWindow();

  const url = process.argv[2];
  if (url) {
    win.loadURL(url); // 开发环境
  } else {
    win.loadFile('./index.html'); // 打包环境
  }

  // 打开调试模式
  if (isDev) {
    win.webContents.openDevTools();
  }

  setMenus();
  setDock();

  if (!isDev) {
    setTray(win);
  }
});
