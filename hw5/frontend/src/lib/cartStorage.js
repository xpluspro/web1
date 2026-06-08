export function getCartSummary(items) {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 0;
  const total = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    shipping: 0,
    total,
  };
}
