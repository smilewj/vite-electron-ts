# vite-electron-ts

基于 vite 和 electron 的项目，前端渲染基于 `vue + pinia + vue-router + element-plus`，electron 打包基于 `electron-builder`。

- electron 服务启动集成在 vite 插件里，会随着 vue 项目一起启动，并且会监听 node 文件夹实现 electron 热更新；
- electron 打包集成在 vite 插件里，会在 vue 打包完成之后自动进行 electron-builder 打包；

## 依赖包安装

```sh
pnpm install
```

### 开发模式

```sh
pnpm dev
```

### 应用打包

```sh
pnpm build:app
```
