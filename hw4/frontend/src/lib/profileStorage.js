const PROFILE_KEY = 'book_store_profile';

const defaultProfile = {
  firstName: 'Tom',
  lastName: 'Cat',
  twitter: '@TomCat',
  notes: 'This is my profile for the Homework 4 integrated bookstore project.',
  avatarUrl:
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readProfile() {
  if (!canUseStorage()) {
    return defaultProfile;
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch (error) {
    return defaultProfile;
  }
}

export function writeProfile(profile) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getDefaultProfile() {
  return defaultProfile;
}
