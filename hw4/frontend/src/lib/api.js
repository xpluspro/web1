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
