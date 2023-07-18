import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { merge } from 'lodash';

const defaultConfig: BrowserWindowConstructorOptions = {
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: true, // 集成Node
    webSecurity: false, // 禁用同源策略
    allowRunningInsecureContent: true, // 允许一个 https 页面运行 http url 里的资源
    webviewTag: true,
    safeDialogs: true, // 启用浏览器样式的持续对话框保护
    plugins: true, // 支持插件
    backgroundThrottling: false, // 在页面成为背景时不限制动画和计时器
    navigateOnDragDrop: true, // 将文件或链接拖放到页面上时是否触发页面跳转
    contextIsolation: false, // 关闭渲染进程的沙箱
  },
  // frame: false,
  // titleBarStyle: 'hidden',
  show: false,
  backgroundColor: '#000',
};

export default class AppWindow extends BrowserWindow {
  constructor(url?: string, config?: BrowserWindowConstructorOptions) {
    const finalConfig = merge(defaultConfig, config);
    super(finalConfig);

    if (url) {
      this.loadURL(url);
    }
    this.once('ready-to-show', () => {
      this.show();
    });
  }
}
