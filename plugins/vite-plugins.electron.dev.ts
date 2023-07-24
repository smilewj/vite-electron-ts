/**
 * electron 开发环境插件
 */
import type { AddressInfo } from 'node:net';
import type { Plugin } from 'vite';
import { spawn } from 'child_process';
import fs from 'fs';
import { buildAppNode, buildConfig } from './build.electron';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import type { FSWatcher } from 'node:fs';

let electronProcess: ChildProcessWithoutNullStreams | undefined;
let fsWatcher: FSWatcher | undefined;

export default function ElectronDevPlugin(): Plugin {
  return {
    name: 'electron-dev-plugin',
    apply: 'serve',
    configureServer(server) {
      buildAppNode();
      server.httpServer?.once('listening', () => {
        const address = server.httpServer?.address() as AddressInfo;
        const url = `http://localhost:${address.port}/`;
        // 参数解释
        // require('electron') 返回 electron 的文件路径
        // ['dist/app-node', url] electron 执行的文件，并把地址发送给 electron
        const electronPath = require('electron') as unknown as string;

        electronProcess = spawn(electronPath, [`${buildConfig.mainDir}/${buildConfig.mainName}.js`, url]);

        fsWatcher = fs.watch('node', () => {
          console.log('主程序更新 ----------->');
          electronProcess && electronProcess.kill();
          buildAppNode();
          electronProcess = spawn(electronPath, [`${buildConfig.mainDir}/${buildConfig.mainName}.js`, url]);
        });

        // 监听electron日志
        electronProcess.stderr.on('data', (data) => {
          console.log(data.toString());
        });
      });
      server.httpServer?.on('close', () => {
        electronProcess && electronProcess.kill();
        fsWatcher && fsWatcher.close();
      });
    },
  };
}
