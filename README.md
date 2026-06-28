# v2ex.k

基于 `WXT + Vue 3 + Manifest V3` 重建的 V2EX 界面增强插件。

## 开发

```bash
npm install
npm run dev
```

执行 `npm run dev` 时会自动打开 `https://v2ex.com/` 方便联调。

## 构建

```bash
npm run build
npm run zip
```

## 当前迁移范围

- 首页 / 节点页 / `recent` / `my/topics` 列表增强
- 左侧导航与 tab 栏
- 阅读面板 iframe
- 主题切换与持久化
- 图片链接转图片

## 说明

- 新实现以 `entrypoints/content.ts` 和 `wxt.config.ts` 为发布入口。
- `legacy/` 目录保存旧 React/jQuery/Vue 1 运行时链路，仅作历史参考。
- 根目录保留的旧 `js/v2ex.k.vue.js`、`css/v2ex.k.vue.css`、`sass/*` 主要用于业务和样式迁移参考，不再参与发布。
