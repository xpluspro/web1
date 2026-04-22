export default function QuantityStepper({ value, onDecrease, onIncrease }) {
  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-full border border-gray-300 bg-white">
      <button
        type="button"
        onClick={onDecrease}
        className="h-full px-4 text-gray-500 transition hover:bg-gray-100"
      >
        -
      </button>
      <span className="min-w-12 px-4 text-center text-sm font-semibold text-gray-900">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        className="h-full px-4 text-gray-500 transition hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}
