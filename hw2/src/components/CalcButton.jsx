function CalcButton({ button, onPress }) {
  const className = [
    "calc-button",
    `variant-${button.variant}`,
    button.span ? `span-${button.span}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={() => onPress(button)}
    >
      {button.label}
    </button>
  );
}

export default CalcButton;
