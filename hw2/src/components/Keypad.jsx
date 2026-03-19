import CalcButton from "./CalcButton";

function Keypad({ rows, onButtonPress }) {
  return (
    <section className="keypad">
      {rows.flat().map((button) => (
        <CalcButton
          key={button.id}
          button={button}
          onPress={onButtonPress}
        />
      ))}
    </section>
  );
}

export default Keypad;
