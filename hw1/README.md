# 书香云端 eBook Store - 项目说明文档

本项目为一个基于纯前端单页架构的电商站点，主要使用了 HTML5 语义化标签、原生 JavaScript 以及 Tailwind CSS 进行构建。满足“严格外部化 CSS 和 JS”的作业规范。

## 🚀 启动说明

本项目的数据状态借助了浏览器的 `LocalStorage` 进行无后端持久化，因此**不需要启动任何后端服务器**即可体验完整的加入购物车、结算等电商闭环功能。

### 方式一：直接运行（推荐日常访问查看）
1. 将项目根目录克隆或下载到本地。
2. 使用现代浏览器（推荐 Chrome、Edge 等）直接打开项目根目录下的 `index.html`。
3. 如果你在使用 VS Code，强烈推荐安装并使用 **Live Server** 插件打开 `index.html`，以获得最佳的本地预览与跳转体验。

### 方式二：开发环境编译（如需修改样式）
项目样式依赖于 Tailwind CSS。如果你的开发需求涉及修改页面元素的 CSS 组合，或者修改了 `src/input.css`，请先进行构建编译：
1. 确保本地已安装 [Node.js](https://nodejs.org/)。
2. 在项目根目录执行以下命令，安装依赖库（主要是 Tailwind 及其插件）：
   ```bash
   npm install
   ```
3. 运行构建脚本重新生成样式（或运行 `--watch` 进入实时监听模式）：
   ```bash
   npm run build
   # 或者执行 npm run watch
   ```

---

## 📂 源文件说明

以下为项目中**所有**源文件及相关资源的详细清单与说明（忽略 `.DS_Store` 及 `node_modules/`、`venv/` 等环境缓存文件夹）：

### 🖥️ 核心页面 (HTML)
*全站 HTML 文件已实现“严格外部 CSS 和 JS 规范”，无内联 `<style>`，无内联 `<script>` 及 `on*` 事件。*
- `index.html`：**商店主页**。包含顶部全局搜索栏设置、带循环动画的图书推荐轮播图模块，以及带有侧边栏（价格分类筛选）的图书商品网格列表。
- `login.html`：**登录与注册页面**。以全屏背景 + 毛玻璃 (Backdrop blur) 视效呈现的用户表单。
- `cart.html`：**购物车页面**。用于读取并展现用户已加购的商品，处理商品数量增减、独立删除，并根据数据变动实时结算由于折扣导致的价格变动。
- `order.html`：**订单确认页面**。负责承接购物车跳转，提供左侧表单（用于接收收货人姓名、手机及配送地址，以及提供支付方式的单选）、右侧小视窗二次核对商品数据。
- `orders.html`：**我的订单页面**。用于集中展示订单状态分组，包含“待支付”（来自当前购物车）与“已支付”（来自订单历史）两个区块。
- `success.html`：**支付成功页**。为购物闭环的最后一环，反馈交易成功的单号，并提供了绑定原生 `window.print()` 的“打印收据”功能交互。
- `details1.html`：图书《重构：改善既有代码的设计》的具体详情页面。
- `details2.html`：图书《人月神话》的具体详情页面。
- `details3.html`：图书《设计模式：可复用面向对象软件的基础》的具体详情页面。
- `details4.html`：图书《代码整洁之道》的具体详情页面。

### ⚙️ 逻辑交互 (JavaScript)
- `main.js`：**全站 UI 交互主干脚本**。汇集了首页轮播、详情页加购、购物车交互、订单确认渲染、订单列表渲染、收据打印等页面行为，并统一通过 `addEventListener` 绑定事件。
- `cart.js`：**数据服务层脚本**。封装购物车与订单历史的 LocalStorage 读写方法，包括 `getCart` / `saveCart` / `addToCart` / `removeItem` 以及 `getOrders` / `saveOrders` / `createOrder`。

### 🎨 样式与配置
- `src/input.css`：Tailwind CSS 的**核心输入样式文件**。仅包含引入全局基础覆盖 (`@tailwind base`) 和通过 `@layer components` 创建如抽象 `.btn` 的自定义组件类。
- `style.css`：**最终编译生成的全局样式文件**。被全站各 HTML 高度复用引入。（不要手动修改此文件，它由 Tailwind 编译生成）。
- `tailwind.config.js`：**Tailwind 配置文件**。用于自定义项目的色彩系统（注入主色调 `primary` 系列）、字体堆栈、以及引入官方插件 (`@tailwindcss/forms` 等)。
- `package.json`：**Node.js 项目清单文件**。记录了项目使用的 npm 版本信息、`tailwindcss` 依赖以及相关的执行脚本宏如 `build`、`watch` 和测试宏等。
- `package-lock.json`：Npm 依据当前系统自动生成并锁定的确定版本依赖树信息文志。

### 📁 媒体及文档
- `images/`: 存放图书商品封面图片 (`book1.jpg` - `book4.jpg`) 等渲染所需静态媒体文件的目录。
- `答题纸.md`：**作业开发迭代记录**。记录了开发各个重大节点及历次根据反馈更新重构（引入 Tailwind 框架、修复侧边框和轮播图、彻底拆分外部 JS 和 CSS）的 Prompt 对话及思考过程。