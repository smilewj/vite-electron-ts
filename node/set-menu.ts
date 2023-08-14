import { Menu, MenuItem, shell, type MenuItemConstructorOptions, app } from 'electron';
import isDev from 'electron-is-dev';

const isMac = process.platform === 'darwin';

const menuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: app.name,
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
      },
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

if (isDev) {
  const devMenuItems: MenuItemConstructorOptions[] = [
    {
      label: '开发者工具',
      accelerator: (() => {
        if (isMac) {
          return 'Alt+Command+I';
        } else {
          return 'F12';
        }
      })(),
      role: 'toggleDevTools',
    },
    {
      label: '刷新页面',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.reload();
        }
      },
    },
  ];
  (menuTemplate[1].submenu as MenuItemConstructorOptions[]).push(...devMenuItems);
}

/**
 * 设置系统菜单
 */
export default function setMenus() {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
