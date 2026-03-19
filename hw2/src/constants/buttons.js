export const BUTTON_ROWS = [
  [
    { id: "clear", label: "C", action: "clear", variant: "danger" },
    { id: "left-paren", label: "(", action: "leftParen", variant: "function" },
    { id: "right-paren", label: ")", action: "rightParen", variant: "function" },
    { id: "percent", label: "%", action: "percent", variant: "function" },
    { id: "backspace", label: "←", action: "backspace", variant: "function" },
  ],
  [
    { id: "7", label: "7", action: "digit", value: "7", variant: "number" },
    { id: "8", label: "8", action: "digit", value: "8", variant: "number" },
    { id: "9", label: "9", action: "digit", value: "9", variant: "number" },
    { id: "divide", label: "÷", action: "operator", value: "÷", variant: "operator" },
    { id: "multiply", label: "×", action: "operator", value: "×", variant: "operator" },
  ],
  [
    { id: "4", label: "4", action: "digit", value: "4", variant: "number" },
    { id: "5", label: "5", action: "digit", value: "5", variant: "number" },
    { id: "6", label: "6", action: "digit", value: "6", variant: "number" },
    { id: "plus-minus", label: "+/-", action: "toggleSign", variant: "function" },
    { id: "minus", label: "-", action: "operator", value: "-", variant: "operator" },
  ],
  [
    { id: "1", label: "1", action: "digit", value: "1", variant: "number" },
    { id: "2", label: "2", action: "digit", value: "2", variant: "number" },
    { id: "3", label: "3", action: "digit", value: "3", variant: "number" },
    { id: "dot", label: ".", action: "decimal", variant: "number" },
    { id: "plus", label: "+", action: "operator", value: "+", variant: "operator" },
  ],
  [
    { id: "0", label: "0", action: "digit", value: "0", variant: "number", span: 2 },
    { id: "equals", label: "=", action: "equals", variant: "accent", span: 3 },
  ],
];
