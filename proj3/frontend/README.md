# 在线书店迭代 3 前端

本项目基于之前的 React 书店前端继续整理，并在迭代 3 中通过 Fetch API 接入 Spring Boot 后端接口。当前实现围绕完整在线书店功能展开：

- `Login` 登录页
- `Book List` 主页
- `Book Detail` 书籍详情页
- `My Cart` 购物车页
- `My Orders` 订单列表页
- `Register` 用户注册页
- `Book Manage` 管理员图书管理页
- `User Manage` 管理员用户管理页
- `All Orders` 管理员订单页
- `Statistics` 统计页

本次实现重点使用 `React`、`React Router`、`Ant Design` 和浏览器原生 `fetch` 完成页面组织、左侧菜单导航、组件拆分和前后端异步通信。登录、注册、书籍浏览、购物车、下单、订单过滤、管理员管理和统计均通过后端 API 读写数据库。

## 技术栈

- React
- React Router
- Ant Design
- Vite

## 后端接口

默认请求地址为 `http://localhost:8080`，可通过环境变量 `VITE_API_BASE_URL` 覆盖。

当前前端使用的接口包括：

- `POST /api/v1/users/login`：数据库用户登录
- `GET /api/v1/books`：获取全部书籍列表
- `GET /api/v1/book/{id}`：获取单本书籍详情
- `POST /api/v1/users/register`：注册新用户
- `GET /api/v1/users`：管理员获取用户列表
- `PUT /api/v1/users/{userId}/status`：管理员禁用或解禁用户
- `GET /api/v1/users/{userId}/cart`：获取购物车
- `POST /api/v1/users/{userId}/cart/items`：加入购物车
- `PUT /api/v1/users/{userId}/cart/items/{bookId}`：修改购物车数量
- `DELETE /api/v1/users/{userId}/cart/items/{bookId}`：删除购物车条目
- `POST /api/v1/users/{userId}/orders`：下订单
- `GET /api/v1/users/{userId}/orders`：获取并过滤顾客订单
- `GET /api/v1/admin/orders`：管理员获取并过滤全部订单
- `POST /api/v1/admin/books` / `PUT /api/v1/admin/books/{id}` / `DELETE /api/v1/admin/books/{id}`：管理员图书管理
- `GET /api/v1/admin/stats/books` / `GET /api/v1/admin/stats/users`：管理员统计榜单
- `GET /api/v1/users/{userId}/orders/stats`：顾客购书统计

默认演示账号：

- 顾客：`tom / 123456`
- 管理员：`admin / 123456`
- 禁用账号：`disabled / 123456`

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
- `/orders`：订单列表页，展示并过滤当前用户订单
- `/login`：登录页，使用数据库中的用户名和密码登录
- `/profile`：注册页，校验用户名、密码、重复密码和邮箱
- `/admin/books`：管理员图书管理
- `/admin/users`：管理员用户禁用/解禁
- `/admin/orders`：管理员查看和过滤全部订单
- `/stats`：管理员统计榜单或顾客个人购书统计

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
│   │   └── registrationDraftStorage.js
│   ├── hooks/
│   │   └── useBookstoreState.js
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
- `App.jsx` 只负责主题和路由装配，跨页面状态与业务回调集中在 `useBookstoreState` 自定义 Hook 中。
- 详情页的 “Add to Shopping Cart” 会调用后端写入数据库购物车；“Purchase Now” 会先加入购物车再跳转到购物车页。
- 购物车页的数量修改、删除和下单会同步到数据库；下单成功后刷新订单列表页。
- 注册页提交时会调用 `POST /api/v1/users/register`，将新用户保存到数据库。

## 已完成验证

已执行：

```bash
npm run build
```

构建通过，生成产物位于 `dist/` 目录。
