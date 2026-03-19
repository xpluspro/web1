const CART_KEY = 'shopping_cart';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readCart() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function writeCart(cartItems) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

export function addCartItem(items, book, quantity) {
  const nextItems = [...items];
  const existing = nextItems.find((item) => item.id === book.id);

  if (existing) {
    existing.qty += quantity;
  } else {
    nextItems.push({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.cover,
      qty: quantity,
    });
  }

  return nextItems;
}

export function updateCartItemQty(items, itemId, quantity) {
  return items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          qty: Math.max(1, quantity),
        }
      : item
  );
}

export function removeCartItem(items, itemId) {
  return items.filter((item) => item.id !== itemId);
}

export function getCartSummary(items) {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const discount = items.length > 0 ? 10 : 0;
  const total = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    shipping: 0,
    total,
  };
}
