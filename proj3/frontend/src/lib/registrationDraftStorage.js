const REGISTRATION_DRAFT_KEY = 'book_store_registration_draft';

const defaultRegistrationDraft = {
  username: 'jerry',
  password: '123456',
  confirmPassword: '123456',
  email: 'jerry@example.com',
  firstName: 'Tom',
  lastName: 'Cat',
  twitter: '@TomCat',
  notes: 'This is my registration draft for the iteration 3 bookstore demo.',
  avatarUrl:
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readRegistrationDraft() {
  if (!canUseStorage()) {
    return defaultRegistrationDraft;
  }

  try {
    const raw = window.localStorage.getItem(REGISTRATION_DRAFT_KEY);
    return raw ? { ...defaultRegistrationDraft, ...JSON.parse(raw) } : defaultRegistrationDraft;
  } catch {
    return defaultRegistrationDraft;
  }
}

export function writeRegistrationDraft(draft) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(REGISTRATION_DRAFT_KEY, JSON.stringify(draft));
}
