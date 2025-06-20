import { AI_SUMMARIZE_URL, NASA_APOD_URL, NASA_MARS_PHOTOS_URL, NASA_NEO_URL } from '../../constants/apiUrls';

export async function getApod() {
  const res = await fetch(NASA_APOD_URL);
  return res.json();
}

export async function getMarsPhotos() {
  const res = await fetch(NASA_MARS_PHOTOS_URL);
  return res.json();
}

export async function getNeoFeed() {
  const res = await fetch(NASA_NEO_URL);
  return res.json();
}

export async function getAiSummary({ text, provider }) {
  const res = await fetch(AI_SUMMARIZE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, provider })
  });
  return res;
}
