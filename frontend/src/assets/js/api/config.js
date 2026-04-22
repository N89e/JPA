// Configuration d'API - Détecte automatiquement l'environnement
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isDevelopment 
  ? `http://${window.location.hostname}:5000/api`
  : "https://portfolio-api-uj5s.onrender.com/api";
