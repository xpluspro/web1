const USER_KEY = 'book_store_user';
const AUTH_KEY = 'book_store_auth';
export const AUTH_CLEARED_EVENT = 'book_store_auth_cleared';

const defaultCredentials = {
  username: 'tom',
  password: '123456',
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readAuth() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    const auth = raw ? JSON.parse(raw) : null;
    return auth?.token && auth?.user ? auth : null;
  } catch {
    return null;
  }
}

export function writeAuth(auth) {
  if (!canUseStorage()) {
    return;
  }

  if (auth?.token && auth?.user) {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    window.localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  } else {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
}

export function readToken() {
  return readAuth()?.token || '';
}

export function clearAuth() {
  writeAuth(null);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CLEARED_EVENT));
  }
}

export function getDefaultCredentials() {
  return defaultCredentials;
}
