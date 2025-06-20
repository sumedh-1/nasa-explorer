import { USER_PREFERENCES_URL, USER_FAVORITES_URL } from '../../constants/apiUrls';

export async function getUserPreferences() {
  const res = await fetch(USER_PREFERENCES_URL);
  return res.json();
}

export async function setUserPreferences(preferences) {
  return fetch(USER_PREFERENCES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferences }),
  });
}

export async function getFavorites(category) {
  const res = await fetch(`${USER_FAVORITES_URL}?category=${category}`);
  return res.json();
}

export async function setFavorites(category, favorites) {
  return fetch(USER_FAVORITES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, favorites }),
  });
}
