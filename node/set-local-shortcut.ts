import { app, globalShortcut } from 'electron';
import type AppWindow from './app-window';

export default function setLocalShortcut(win: AppWindow) {
  // 注册全局快捷键
  app.whenReady().then(() => {
    // 下一首
    globalShortcut.register('MediaNextTrack', () => {
      win.webContents.send('media-next-track');
    });
    // 播放/暂停
    globalShortcut.register('MediaPlayPause', () => {
      win.webContents.send('media-play-pause');
    });
    // 上一首
    globalShortcut.register('MediaPreviousTrack', () => {
      win.webContents.send('media-previous-track');
    });
  });

  // 当应用程序退出之前，取消注册全局快捷键
  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
}
