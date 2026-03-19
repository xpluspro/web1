function getLastChar(expression) {
  return expression.at(-1) ?? "";
}

function isValueEnding(char) {
  return /[0-9)]/.test(char) || char === "%";
}

function isOperator(char) {
  return ["+", "-", "×", "÷"].includes(char);
}

function getCurrentNumberFragment(expression) {
  let index = expression.length - 1;
  let fragment = "";

  while (index >= 0 && /[0-9.]/.test(expression[index])) {
    fragment = expression[index] + fragment;
    index -= 1;
  }

  return fragment;
}

function countChar(expression, target) {
  return [...expression].filter((char) => char === target).length;
}

function isUnaryMinus(expression, index) {
  if (expression[index] !== "-") {
    return false;
  }

  if (index === 0) {
    return true;
  }

  const prev = expression[index - 1];
  return isOperator(prev) || prev === "(";
}

function findMatchingLeftParen(expression, rightIndex) {
  let depth = 0;

  for (let index = rightIndex; index >= 0; index -= 1) {
    if (expression[index] === ")") {
      depth += 1;
    } else if (expression[index] === "(") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findOperandRange(expression) {
  if (!expression) {
    return null;
  }

  let end = expression.length - 1;

  while (end >= 0 && expression[end] === "%") {
    end -= 1;
  }

  if (end < 0) {
    return null;
  }

  let start = end;
  const tail = expression[end];

  if (tail === ")") {
    start = findMatchingLeftParen(expression, end);
    if (start < 0) {
      return null;
    }
  } else if (/[0-9.]/.test(tail)) {
    while (start >= 0 && /[0-9.]/.test(expression[start])) {
      start -= 1;
    }
    start += 1;
  } else {
    return null;
  }

  const minusIndex = start - 1;

  if (minusIndex >= 0 && isUnaryMinus(expression, minusIndex)) {
    start = minusIndex;
  }

  return { start, end: expression.length - 1 };
}

export function appendDigit(expression, digit) {
  const last = getLastChar(expression);

  if (!expression) {
    return digit;
  }

  if (last === ")" || last === "%") {
    return `${expression}×${digit}`;
  }

  return `${expression}${digit}`;
}

export function appendDecimal(expression) {
  const last = getLastChar(expression);

  if (!expression) {
    return "0.";
  }

  if (last === ")" || last === "%") {
    return `${expression}×0.`;
  }

  if (isOperator(last) || last === "(") {
    return `${expression}0.`;
  }

  if (last === "." || getCurrentNumberFragment(expression).includes(".")) {
    return expression;
  }

  return `${expression}.`;
}

export function appendOperator(expression, operator) {
  const last = getLastChar(expression);

  if (!expression) {
    return operator === "-" ? "-" : expression;
  }

  if (last === ".") {
    return expression;
  }

  if (last === "(") {
    return operator === "-" ? `${expression}-` : expression;
  }

  if (isOperator(last)) {
    if (operator === "-" && last !== "-") {
      return `${expression}-`;
    }
    return `${expression.slice(0, -1)}${operator}`;
  }

  if (!isValueEnding(last)) {
    return expression;
  }

  return `${expression}${operator}`;
}

export function appendLeftParen(expression) {
  const last = getLastChar(expression);

  if (!expression) {
    return "(";
  }

  if (isValueEnding(last)) {
    return `${expression}×(`;
  }

  if (last === "." || last === "%") {
    return expression;
  }

  return `${expression}(`;
}

export function appendRightParen(expression) {
  const last = getLastChar(expression);
  const leftCount = countChar(expression, "(");
  const rightCount = countChar(expression, ")");

  if (!expression || leftCount <= rightCount) {
    return expression;
  }

  if (!isValueEnding(last)) {
    return expression;
  }

  return `${expression})`;
}

export function appendPercent(expression) {
  const last = getLastChar(expression);

  if (!expression || last === "%" || !isValueEnding(last)) {
    return expression;
  }

  return `${expression}%`;
}

export function toggleSign(expression) {
  const range = findOperandRange(expression);

  if (!range) {
    return expression ? expression : "-";
  }

  const { start } = range;

  if (expression[start] === "-" && isUnaryMinus(expression, start)) {
    return `${expression.slice(0, start)}${expression.slice(start + 1)}`;
  }

  return `${expression.slice(0, start)}-${expression.slice(start)}`;
}

export function removeLastToken(expression) {
  return expression.slice(0, -1);
}
