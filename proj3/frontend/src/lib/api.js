import { clearAuth, readToken } from './sessionStorage.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const token = readToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Ignore JSON parsing errors and keep the default message.
    }

    if (response.status === 401) {
      clearAuth();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
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

export function fetchUsers() {
  return request('/api/v1/users');
}

export function updateUserStatus(userId, disabled) {
  return request(`/api/v1/users/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ disabled }),
  });
}

export function createBook(book) {
  return request('/api/v1/admin/books', {
    method: 'POST',
    body: JSON.stringify(book),
  });
}

export function updateBook(bookId, book) {
  return request(`/api/v1/admin/books/${bookId}`, {
    method: 'PUT',
    body: JSON.stringify(book),
  });
}

export function deleteBook(bookId) {
  return request(`/api/v1/admin/books/${bookId}`, {
    method: 'DELETE',
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

export function fetchOrders(userId, filters = {}) {
  return request(`/api/v1/users/${userId}/orders${buildQuery(filters)}`);
}

export function fetchAllOrders(filters = {}) {
  return request(`/api/v1/admin/orders${buildQuery(filters)}`);
}

export function fetchBookSalesStats(filters = {}) {
  return request(`/api/v1/admin/stats/books${buildQuery(filters)}`);
}

export function fetchUserConsumptionStats(filters = {}) {
  return request(`/api/v1/admin/stats/users${buildQuery(filters)}`);
}

export function fetchCustomerStats(userId, filters = {}) {
  return request(`/api/v1/users/${userId}/orders/stats${buildQuery(filters)}`);
}
