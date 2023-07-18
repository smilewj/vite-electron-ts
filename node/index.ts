/**
 * electron 主入口文件
 */
import { app } from 'electron';
import AppWindow from './app-window';

app.whenReady().then(() => {
  const win = new AppWindow();

  const url = process.argv[2];
  if (url) {
    win.loadURL(url); // 开发环境
  } else {
    win.loadFile('./index.html'); // 打包环境
  }
});
