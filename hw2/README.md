# 作业2 - React 计算器重构

## 运行方式

```bash
npm install
npm run dev
```

## 构件拆分

- `src/components/CalculatorPage.jsx`：顶层页面，组合显示区和键盘。
- `src/components/DisplayPanel.jsx`：纯展示组件，接收 `history / expression / preview / error`。
- `src/components/Keypad.jsx`：根据按钮配置渲染键盘。
- `src/components/CalcButton.jsx`：单个按钮构件。
- `src/hooks/useCalculator.js`：集中管理状态与交互逻辑。
- `src/utils/expressionParser.js`：词法分析、AST 构建、递归求值。
- `src/utils/expressionInput.js`：表达式输入规则与字符串编辑辅助函数。

## 核心改动

- 将原始单文件计算器拆分为多个模块，符合构件式开发要求。
- 状态集中在 `useCalculator` 中，子组件通过 `props` 接收数据和事件处理函数。
- 新增括号 `()` 支持，并基于抽象语法树解析 `5×(2+3)` 这类表达式。
