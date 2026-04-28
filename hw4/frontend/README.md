# 在线书店作业 4 前端

本项目基于之前的 React 书店前端继续整理，并在作业 4 中接入 Spring Boot 后端接口。当前实现围绕 4 个核心页面展开：

- `Book List` 主页
- `Book Detail` 书籍详情页
- `My Cart` 购物车页
- `My Profile` 个人信息页

本次实现重点使用 `React`、`React Router` 和 `Ant Design` 完成页面组织、左侧菜单导航、组件拆分和样式统一。书籍列表、书籍详情和用户注册已通过后端 API 获取或提交数据；购物车仍保存在浏览器本地存储中，用于保留前端交互演示。

## 技术栈

- React
- React Router
- Ant Design
- Vite

## 后端接口

默认请求地址为 `http://localhost:8080`，可通过环境变量 `VITE_API_BASE_URL` 覆盖。

当前前端使用的接口包括：

- `GET /api/v1/books`：获取全部书籍列表
- `GET /api/v1/book/{id}`：获取单本书籍详情
- `POST /api/v1/users/register`：提交个人信息并注册用户

## 运行方式

启动前端前，请先启动后端服务。默认情况下后端监听 `8080` 端口。

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
- `/books/:id`：书籍详情页，展示封面、基本信息、简介和按钮
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
│   ├── lib/
│   │   ├── api.js
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
├── index.html
├── package.json
├── vite.config.mjs
└── 作业答题纸.docx
```

## 设计说明

- 使用 `Layout + Sider + Header + Content` 搭建整体骨架，左侧 `Menu` 完成页面切换，贴合作业样例。
- `src/lib/api.js` 统一封装后端请求，书籍列表、书籍详情和用户注册都通过该文件调用接口。
- `App.jsx` 只保留顶层状态和路由装配，购物车与个人资料的本地持久化逻辑放在 `src/lib` 中。
- 详情页的 “Add to Shopping Cart” 与 “Purchase Now” 按钮保留前端交互展示，购物车暂不接入后端。
- 个人信息页提交时会调用 `POST /api/v1/users/register`，成功后同步更新前端本地状态。

## 已完成验证

已执行：

```bash
npm run build
```

构建通过，生成产物位于 `dist/` 目录。
