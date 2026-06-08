const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Ignore JSON parsing errors and keep the default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export function fetchBooks() {
  return request('/api/v1/books');
}

export function fetchBookById(bookId) {
  return request(`/api/v1/book/${bookId}`);
}

export function registerUser(profile) {
  return request('/api/v1/users/register', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
}

export function loginUser(credentials) {
  return request('/api/v1/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function fetchCart(userId) {
  return request(`/api/v1/users/${userId}/cart`);
}

export function addCartItem(userId, bookId, quantity) {
  return request(`/api/v1/users/${userId}/cart/items`, {
    method: 'POST',
    body: JSON.stringify({ bookId, quantity }),
  });
}

export function updateCartItem(userId, bookId, quantity) {
  return request(`/api/v1/users/${userId}/cart/items/${bookId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(userId, bookId) {
  return request(`/api/v1/users/${userId}/cart/items/${bookId}`, {
    method: 'DELETE',
  });
}

export function checkoutCart(userId) {
  return request(`/api/v1/users/${userId}/orders`, {
    method: 'POST',
  });
}

export function fetchOrders(userId) {
  return request(`/api/v1/users/${userId}/orders`);
}
