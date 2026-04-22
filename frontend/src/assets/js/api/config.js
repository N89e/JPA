// Configuration de l'API - Lecture du meta tag

// Récupérer l'URL de l'API depuis le meta tag
const metaTag = document.querySelector('meta[name="api-url"]');
const apiBaseUrl = metaTag?.content;

if (!apiBaseUrl) {
  console.error('❌ Meta tag "api-url" non trouvé dans index.html');
}

export const API_BASE_URL = apiBaseUrl || '/api'; // Fallback sûr

// DEBUG (développement)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔌 API URL:', API_BASE_URL);
}


