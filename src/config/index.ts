type modeTypes = 'prod' | 'dev';

const baseUrl = import.meta.env.BASE_URL;
const mode = import.meta.env.MODE as modeTypes;

const publicConfig = {
  apiHost: `${baseUrl}apiProxy`, // 接口代理关键字
  appName: '统一身份认证管理系统', // 系统名称
};

// 正式环境
const prodConfig = {
  ...publicConfig,
  mode: 'prod',
};

// 开发环境
const devConfig = {
  ...publicConfig,
  mode: 'dev',
};

const envMap = {
  prod: prodConfig,
  dev: devConfig,
};

export default envMap[mode] || envMap.dev;
