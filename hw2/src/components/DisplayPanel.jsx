function DisplayPanel({ history, expression, preview, error }) {
  return (
    <section className="display-panel">
      <div className="display-meta">
        <span>{history || "等待输入表达式"}</span>
        <span className={error ? "status error" : "status"}>
          {error || preview || "AST ready"}
        </span>
      </div>

      <div className="display-expression">
        {expression || "0"}
      </div>
    </section>
  );
}

export default DisplayPanel;
