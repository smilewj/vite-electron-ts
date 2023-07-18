/**
 * 打包配置
 */
export const buildConfig = {
  /** electron 代码编译之后的文件名称 */
  mainName: 'app-node',
  /** electron/vue 代码编译的之后存放的目录 */
  mainDir: 'dist',
  /** 应用打包之后存放的目录 */
  appDir: 'release',
};

/**
 * 打包electron代码
 */
export function buildAppNode() {
  require('esbuild').buildSync({
    entryPoints: ['node/index.ts'],
    bundle: true, // 是否把所有依赖都打进去
    outfile: `${buildConfig.mainDir}/${buildConfig.mainName}.js`,
    platform: 'node', // 指定运行环境
    target: 'node16', // 指定node版本
    external: ['electron'], // 排除electron依赖
  });
}
