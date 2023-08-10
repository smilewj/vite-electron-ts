import { Menu, MenuItem, app } from 'electron';

const isMac = process.platform === 'darwin';

export default function setDock() {
  if (isMac) {
    const quitMenuItem = new MenuItem({
      label: '关闭应用',
      click: () => {
        app.exit(); // 关闭应用
      },
    });

    // 创建一个菜单
    const menu = new Menu();
    menu.append(quitMenuItem);
    app.dock.setMenu(menu);

    // console.log('----> getBadge', app.dock.getMenu());
  }
}
