import { Menu, Tray, app, nativeImage } from 'electron';
import path from 'path';
import type AppWindow from './app-window';
const isMac = process.platform === 'darwin';

/**
 * 将应用程序隐藏到系统顶部状态栏（也称为系统托盘）
 * @param win 主窗口
 */
export default function setTray(win: AppWindow) {
  const iconPath = path.join(__dirname, 'trayTemplate.png');
  const image = nativeImage.createFromPath(iconPath);
  image.setTemplateImage(true);

  const tray = new Tray(image);

  // 可选：定义 Tray 的上下文菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        app.dock.show();
        win.setSkipTaskbar(false);
        win.show();
      },
    },
    {
      label: '隐藏',
      click: () => {
        app.dock.hide();
        win.setSkipTaskbar(true);
        win.hide();
      },
    },
    {
      label: '退出',
      click: () => {
        app.exit();
      },
    },
  ]);
  tray.setToolTip('My音乐'); // 鼠标悬停时显示的提示
  tray.setContextMenu(contextMenu); // 设置上下文菜单

  win.on('close', (event) => {
    event.preventDefault(); // 阻止默认的关闭行为
    if (isMac) app.dock.hide();
    win.setSkipTaskbar(true);
    win.hide();
  });
}
