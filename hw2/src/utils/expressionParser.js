const DISPLAY_OPERATOR_MAP = {
  "×": "*",
  "÷": "/",
};

const BINARY_PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

function normalizeExpression(expression) {
  return expression.replace(/[×÷]/g, (operator) => DISPLAY_OPERATOR_MAP[operator]);
}

function isDigit(char) {
  return char >= "0" && char <= "9";
}

export function tokenizeExpression(expression) {
  const normalized = normalizeExpression(expression).replace(/\s+/g, "");
  const tokens = [];
  let index = 0;

  while (index < normalized.length) {
    const char = normalized[index];

    if (isDigit(char) || char === ".") {
      let number = char;
      index += 1;

      while (
        index < normalized.length &&
        (isDigit(normalized[index]) || normalized[index] === ".")
      ) {
        number += normalized[index];
        index += 1;
      }

      if (number === "." || Number.isNaN(Number(number))) {
        throw new Error("数字格式不正确");
      }

      tokens.push({ type: "number", value: Number(number) });
      continue;
    }

    if ("+-*/()%".includes(char)) {
      tokens.push({ type: char, value: char });
      index += 1;
      continue;
    }

    throw new Error(`无法识别字符: ${char}`);
  }

  return tokens;
}

function createParser(tokens) {
  let current = 0;

  function peek() {
    return tokens[current];
  }

  function match(...types) {
    if (current >= tokens.length) {
      return null;
    }

    const token = tokens[current];

    if (!types.includes(token.type)) {
      return null;
    }

    current += 1;
    return token;
  }

  function expect(type, message) {
    const token = match(type);

    if (!token) {
      throw new Error(message);
    }

    return token;
  }

  function parsePrimary() {
    const numberToken = match("number");

    if (numberToken) {
      return {
        type: "NumberLiteral",
        value: numberToken.value,
      };
    }

    if (match("(")) {
      const expression = parseExpression();
      expect(")", "缺少右括号");
      return {
        type: "GroupingExpression",
        expression,
      };
    }

    throw new Error("表达式结构不完整");
  }

  function parsePostfix() {
    let node = parsePrimary();

    while (match("%")) {
      node = {
        type: "PercentExpression",
        argument: node,
      };
    }

    return node;
  }

  function parseUnary() {
    const unaryToken = match("+", "-");

    if (unaryToken) {
      return {
        type: "UnaryExpression",
        operator: unaryToken.type,
        argument: parseUnary(),
      };
    }

    return parsePostfix();
  }

  function parseBinary(minPrecedence) {
    let left = parseUnary();

    while (true) {
      const token = peek();

      if (!token || !(token.type in BINARY_PRECEDENCE)) {
        break;
      }

      const precedence = BINARY_PRECEDENCE[token.type];

      if (precedence < minPrecedence) {
        break;
      }

      current += 1;

      const right = parseBinary(precedence + 1);

      left = {
        type: "BinaryExpression",
        operator: token.type,
        left,
        right,
      };
    }

    return left;
  }

  function parseExpression() {
    return parseBinary(1);
  }

  const ast = parseExpression();

  if (current < tokens.length) {
    throw new Error("存在未处理的输入");
  }

  return ast;
}

export function parseExpressionToAst(expression) {
  const tokens = tokenizeExpression(expression);

  if (tokens.length === 0) {
    throw new Error("表达式为空");
  }

  return createParser(tokens);
}

export function evaluateAst(node) {
  switch (node.type) {
    case "NumberLiteral":
      return node.value;
    case "GroupingExpression":
      return evaluateAst(node.expression);
    case "UnaryExpression": {
      const argument = evaluateAst(node.argument);
      return node.operator === "-" ? -argument : argument;
    }
    case "PercentExpression":
      return evaluateAst(node.argument) / 100;
    case "BinaryExpression": {
      const left = evaluateAst(node.left);
      const right = evaluateAst(node.right);

      switch (node.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          if (right === 0) {
            throw new Error("除数不能为 0");
          }
          return left / right;
        default:
          throw new Error("未知运算符");
      }
    }
    default:
      throw new Error("未知语法节点");
  }
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) {
    throw new Error("结果超出范围");
  }

  const rounded = Number(value.toFixed(12));
  return rounded.toString();
}

export function evaluateExpression(expression) {
  const ast = parseExpressionToAst(expression);
  return {
    ast,
    value: evaluateAst(ast),
  };
}
