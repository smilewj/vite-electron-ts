/**
 * electron 打包插件
 * 需要先等 vite 打包完成在执行 electron-builder 打包
 */
import type { Plugin, ResolvedConfig } from 'vite';
import { buildAppNode, buildConfig } from './build.electron';
import fs from 'fs';
import * as ELectronBuilder from 'electron-builder';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

let extraResources: ELectronBuilder.FileSet[] | null;
if (ffmpegPath) {
  const ffmpeg = path.basename(ffmpegPath);
  extraResources = [{ from: ffmpegPath, to: `./${ffmpeg}` }];
}

let config: ResolvedConfig | undefined;

export default function ElectronBuildPlugin(): Plugin {
  return {
    name: 'electron-build-plugin',
    apply: 'build',
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig;
    },
    closeBundle() {
      buildAppNode();

      // 只有mode是app时，执行electron打包操作
      if (config?.mode !== 'app') {
        return;
      }

      // 打包目标目录
      const targetPath = path.resolve(process.cwd(), buildConfig.appDir);
      // 打包源码目录
      const appPath = path.resolve(process.cwd(), buildConfig.mainDir);

      // electron-builder 需要指定 package.json 的 main 属性
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      packageJson.main = `${buildConfig.mainName}.js`;
      fs.writeFileSync(`${buildConfig.mainDir}/package.json`, JSON.stringify(packageJson, null, 2));
      // electron-builder 有一个 bug，他会自动下载垃圾文件，手动创建 node_modules 文件夹来解决
      fs.mkdirSync(`${buildConfig.mainDir}/node_modules`);
      // 删除已存在的打包记录
      fs.rmSync(targetPath, { recursive: true, force: true });

      // electron-builder 打包
      ELectronBuilder.build({
        config: {
          directories: {
            output: targetPath,
            app: appPath,
          },
          files: ['**/*'],
          extraResources,
          asar: true, // 开启打包压缩
          appId: 'music-player',
          productName: 'MY音乐',
          // 安装配置
          nsis: {
            oneClick: false, // 取消一键安装
            allowToChangeInstallationDirectory: true, // 允许用户选择安装目录
          },
          mac: {
            icon: path.resolve(process.cwd(), 'node/assets/icon.icns'),
            target: 'dmg',
          },
          win: {
            icon: path.resolve(process.cwd(), 'node/assets/icon.ico'),
            target: 'portable',
          },
          dmg: {
            icon: path.resolve(process.cwd(), 'node/assets/icon.icns'),
          },
        },
      });
    },
  };
}
