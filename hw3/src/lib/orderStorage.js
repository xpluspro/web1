const ORDER_KEY = 'ebook_orders';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readOrders() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function writeOrders(orders) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}

export function prependOrder(orders, order) {
  return [order, ...orders];
}

export function updateOrderStatus(orders, orderNumber, status, extra = {}) {
  return orders.map((order) =>
    order.orderNumber === orderNumber
      ? {
          ...order,
          status,
          ...extra,
        }
      : order
  );
}
