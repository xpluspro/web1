import { useEffect, useState } from "react";
import {
  evaluateExpression,
  formatNumber,
} from "../utils/expressionParser";
import {
  appendDecimal,
  appendDigit,
  appendLeftParen,
  appendOperator,
  appendPercent,
  appendRightParen,
  removeLastToken,
  toggleSign,
} from "../utils/expressionInput";

const KEYBOARD_ACTIONS = {
  Enter: { action: "equals" },
  "=": { action: "equals" },
  Escape: { action: "clear" },
  Backspace: { action: "backspace" },
  "(": { action: "leftParen" },
  ")": { action: "rightParen" },
  "%": { action: "percent" },
  ".": { action: "decimal" },
  "+": { action: "operator", value: "+" },
  "-": { action: "operator", value: "-" },
  "*": { action: "operator", value: "×" },
  "/": { action: "operator", value: "÷" },
};

function canPreview(expression) {
  if (!expression) {
    return false;
  }

  const last = expression.at(-1);
  return /[0-9)%]/.test(last);
}

export function useCalculator() {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  function commitExpression(nextExpression) {
    setExpression(nextExpression);
    setError("");
  }

  function evaluateCurrentExpression() {
    if (!expression) {
      return;
    }

    try {
      const { value } = evaluateExpression(expression);
      const output = formatNumber(value);
      setHistory(`${expression} =`);
      setExpression(output);
      setPreview("");
      setError("");
    } catch (evaluationError) {
      setError(evaluationError.message);
    }
  }

  function handleButtonPress(button) {
    switch (button.action) {
      case "digit":
        commitExpression(appendDigit(expression, button.value));
        break;
      case "decimal":
        commitExpression(appendDecimal(expression));
        break;
      case "operator":
        commitExpression(appendOperator(expression, button.value));
        break;
      case "leftParen":
        commitExpression(appendLeftParen(expression));
        break;
      case "rightParen":
        commitExpression(appendRightParen(expression));
        break;
      case "percent":
        commitExpression(appendPercent(expression));
        break;
      case "toggleSign":
        commitExpression(toggleSign(expression));
        break;
      case "backspace":
        commitExpression(removeLastToken(expression));
        break;
      case "clear":
        setExpression("");
        setHistory("");
        setPreview("");
        setError("");
        break;
      case "equals":
        evaluateCurrentExpression();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (!canPreview(expression)) {
      setPreview("");
      return;
    }

    try {
      const { value } = evaluateExpression(expression);
      setPreview(`= ${formatNumber(value)}`);
    } catch {
      setPreview("");
    }
  }, [expression]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        handleButtonPress({ action: "digit", value: event.key });
        return;
      }

      const mappedButton = KEYBOARD_ACTIONS[event.key];

      if (!mappedButton) {
        return;
      }

      event.preventDefault();
      handleButtonPress(mappedButton);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expression]);

  return {
    display: {
      history,
      expression,
      preview,
      error,
    },
    handleButtonPress,
  };
}
