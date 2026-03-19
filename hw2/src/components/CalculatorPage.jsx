import DisplayPanel from "./DisplayPanel";
import Keypad from "./Keypad";
import { BUTTON_ROWS } from "../constants/buttons";
import { useCalculator } from "../hooks/useCalculator";

function CalculatorPage() {
  const { display, handleButtonPress } = useCalculator();

  return (
    <main className="page-shell">
      <section className="calculator-card">
        <div className="calculator-copy">
          <p className="eyebrow">Homework 2</p>
          <h1>React Calculator Refactor</h1>
          <p className="description">
            将原始的单文件计算器拆分为独立模块，并通过抽象语法树解析
            `+ - × ÷ () %` 表达式。
          </p>
        </div>

        <DisplayPanel
          history={display.history}
          expression={display.expression}
          preview={display.preview}
          error={display.error}
        />

        <Keypad
          rows={BUTTON_ROWS}
          onButtonPress={handleButtonPress}
        />
      </section>
    </main>
  );
}

export default CalculatorPage;
