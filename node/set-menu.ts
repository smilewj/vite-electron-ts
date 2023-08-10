import { Menu, MenuItem, shell, type MenuItemConstructorOptions, app } from 'electron';

const menuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: app.name,
    submenu: [
      {
        label: '关闭应用',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.exit();
        },
      },
    ],
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: '学习更多',
        click: () => {
          shell.openExternal('https://www.electronjs.org/zh/');
        },
      },
    ],
  },
];

/**
 * 设置系统菜单
 */
export default function setMenus() {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
