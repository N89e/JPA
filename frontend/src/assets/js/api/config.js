// Configuration de l'API

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

let apiBaseUrl;

if (isLocalhost) {
  apiBaseUrl = 'http://localhost:5000/api';
} else {
  const metaTag = document.querySelector('meta[name="api-url"]');
  apiBaseUrl = metaTag?.content;

  if (!apiBaseUrl) {
    console.error('❌ Meta tag "api-url" non trouvé dans index.html');
  }
}

export const API_BASE_URL = apiBaseUrl || '/api';

if (isLocalhost) {
  console.log('🔌 API URL:', API_BASE_URL);
}


