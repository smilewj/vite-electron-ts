/**
 * electron 主入口文件
 */
import { app } from 'electron';
import AppWindow from './app-window';
import setMenus from './set-menu';
import isDev from 'electron-is-dev';
import initIpcMainHandle from './preload/handle';
import setTray from './setTray';

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

  if (!isDev) {
    setTray(win);
  }

  win.on('close', (event) => {
    event.preventDefault(); // 阻止默认的关闭行为
    app.dock.hide();
    win.setSkipTaskbar(true);
    win.hide();
  });
});
