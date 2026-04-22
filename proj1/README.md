# 在线书店迭代 1

本项目基于之前的 `hw3` React 书店工程继续整理，收敛为更贴合课程 `task.pdf` 要求的迭代 1 前端版本。当前实现严格围绕 4 个核心页面展开：

- `Book List` 主页
- `Book Detail` 书籍详情页
- `My Cart` 购物车页
- `My Profile` 个人信息页

本次重构重点使用 `React`、`React Router` 和 `Ant Design` 完成页面组织、左侧菜单导航、组件拆分和样式统一，所有数据均保存在前端本地文件或浏览器本地存储中，不依赖后端接口。

## 技术栈

- React
- React Router
- Ant Design
- Vite

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

## 页面与路由

- `/books`：书店主页，展示搜索框、轮播推荐和图书卡片列表
- `/books/:slug`：书籍详情页，展示封面、基本信息、简介和按钮
- `/cart`：购物车页，展示商品表格、数量修改、删除和金额汇总
- `/profile`：个人信息页，展示表单、头像上传和保存按钮

根路径 `/` 会自动重定向到 `/books`。

## 项目结构

```text
.
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   └── BookCard.jsx
│   ├── data/
│   │   └── books.js
│   ├── lib/
│   │   ├── cartStorage.js
│   │   ├── format.js
│   │   └── profileStorage.js
│   ├── pages/
│   │   ├── BookDetailPage.jsx
│   │   ├── BookListPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── ProfilePage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── spa.css
├── package.json
└── 作业答题纸.docx
```

## 设计说明

- 使用 `Layout + Sider + Header + Content` 搭建整体骨架，左侧 `Menu` 完成页面切换，贴合作业样例。
- 书籍数据集中在 `src/data/books.js`，便于维护和后续扩展。
- `App.jsx` 只保留顶层状态和路由装配，购物车与个人资料的本地持久化逻辑放在 `src/lib` 中。
- 详情页的 “Add to Shopping Cart” 与 “Purchase Now” 按钮保留前端交互展示，但不连接后端，符合迭代 1 要求。
- 个人信息页的保存操作仅更新前端状态和 `localStorage`，不做网络请求。

## 已完成验证

已执行：

```bash
npm run build
```

构建通过，生成产物位于 `dist/` 目录。
