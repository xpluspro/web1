# 书香云端 eBook Store - React 重构版

本项目将原来的多页面静态书店重构为基于 React 和 React Router 的单页应用。现在书籍列表页、详情页、购物车、订单确认页、支付成功页和登录页都统一运行在同一个前端工程中，书籍数据集中管理，页面间跳转由路由完成，购物车状态由 React 状态和 `localStorage` 共同维护。

## 运行方式

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

说明：

- `npm run dev` 会先重新生成 `style.css`，再启动 Vite 开发服务器。
- `npm run build` 会先重新生成 `style.css`，再执行生产构建。
- 如果你只是在调整 Tailwind 输入文件并希望持续监听，可以额外运行 `npm run watch:css`。

## 已完成的重构内容

- 使用 React 重写页面结构，入口统一为 `index.html + src/main.jsx`。
- 使用 React Router 管理路由，核心路由包括 `/`、`/books/:slug`、`/cart`、`/order`、`/success`、`/login`。
- 将 4 个重复的详情页合并为 1 个动态详情页组件。
- 将书籍数据集中到 `src/data/books.js`，避免数据散落在 HTML 和 `data-*` 属性中。
- 将购物车逻辑集中到 `src/lib/cartStorage.js`，通过 React `state` 驱动界面刷新，并使用 `localStorage` 做持久化。
- 抽取公共布局与复用组件，包括页头、页脚、书卡、价格筛选、数量步进器和订单摘要组件。

## 目录结构

```text
.
├── index.html
├── package.json
├── public/
│   └── images/
├── src/
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── input.css
│   ├── main.jsx
│   └── spa.css
├── style.css
├── tailwind.config.js
├── vite.config.mjs
└── 答题纸.md
```

## 关键文件说明

- `src/App.jsx`：应用总入口，负责路由装配、搜索筛选状态、购物车状态和订单状态。
- `src/data/books.js`：统一维护书籍列表、推荐书籍和价格筛选规则。
- `src/lib/cartStorage.js`：购物车读写、数量修改、删除商品和订单摘要计算。
- `src/pages/BookListPage.jsx`：书籍列表页，负责搜索与价格筛选结果展示。
- `src/pages/BookDetailPage.jsx`：动态书籍详情页，根据路由参数和页面状态展示对应图书。
- `src/pages/CartPage.jsx`、`src/pages/OrderPage.jsx`、`src/pages/SuccessPage.jsx`：购买链路页面。
- `src/components/`：存放可复用 UI 组件，体现 React 构件化开发方式。

## 数据与状态设计

- 书籍静态数据来自 `src/data/books.js`。
- 列表页的搜索词和价格筛选由 `App.jsx` 中的 React `state` 维护。
- 详情页通过路由参数和 `Link state` 定位当前书籍，并通过 `props` 接收数据与操作函数。
- 购物车状态由 `App.jsx` 统一维护，变更后自动写入 `localStorage`。
- 下单成功后会清空购物车，并把最新订单信息传递到成功页展示。

## 验证结果

已执行：

```bash
npm run build
```

构建通过，生成产物位于 `dist/` 目录。
