const USER_KEY = 'book_store_user';

const defaultCredentials = {
  username: 'tom',
  password: '123456',
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readUser() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeUser(user) {
  if (!canUseStorage()) {
    return;
  }

  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_KEY);
  }
}

export function getDefaultCredentials() {
  return defaultCredentials;
}
