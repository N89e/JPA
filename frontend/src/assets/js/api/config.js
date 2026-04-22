// Configuration flexible de l'API

// Détecter l'environnement
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

// Lire l'URL depuis le meta tag (default: /api)
const metaUrl = document.querySelector('meta[name="api-url"]')?.content;

let apiBaseUrl = metaUrl;

// Si pas de meta tag, détecter automatiquement
if (!apiBaseUrl) {
  if (isDevelopment) {
    apiBaseUrl = `http://${window.location.hostname}:5000/api`;
  } else {
    // En production: API sur le même domaine
    apiBaseUrl = `${window.location.protocol}//${window.location.host}/api`;
  }
}

export const API_BASE_URL = apiBaseUrl;

// DEBUG (développement)
if (isDevelopment) {
  console.log('🔌 API URL:', API_BASE_URL);
}
