/**
 * Spinner Loading Manager
 * Gère le spinner de chargement et l'animation d'ouverture
 */

import { API_BASE_URL } from './api/config.js';

export function initSpinner() {
  // Le spinner overlay est déjà dans le HTML
  // Ajouter la classe pour désactiver le scroll
  document.body.classList.add('spinner-active');

  // Démarrer le spinner immédiatement pour 3 secondes minimum
  // Puis attendre le chargement complet si nécessaire
  const spinnerMinTime = 3000; // 3 secondes d'animation minimum
  const startTime = Date.now();

  waitForPageReady().then(() => {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, spinnerMinTime - elapsed);
    
    // Attendre le temps restant avant de fermer
    setTimeout(() => {
      closeSpinner();
    }, remainingTime);
  });
}

function waitForPageReady() {
  return new Promise((resolve) => {
    // Si le DOM est déjà chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        checkBackendAndResolve(resolve);
      });
    } else {
      checkBackendAndResolve(resolve);
    }
  });
}

function checkBackendAndResolve(resolve) {
  // Attendre que window.onload soit complètement chargé (toutes les ressources)
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => {
      // Petite attente supplémentaire pour que toutes les animations aient démarré
      setTimeout(() => {
        testBackendConnection().then(resolve);
      }, 300);
    });
  } else {
    // Tout est déjà chargé
    testBackendConnection().then(resolve);
  }
}

function testBackendConnection() {
  return new Promise((resolve) => {
    // Timeout maximal de 3 secondes avant de passer à l'étape suivante
    const timeoutId = setTimeout(() => {
      console.warn('Timeout: Le backend met trop de temps à répondre (> 3s), continuant...');
      resolve();
    }, 3000);

    // Essayer de se connecter au backend avec une route qui existe
    fetch(`${API_BASE_URL}/projects`, { 
      method: 'GET',
      timeout: 2000 
    })
      .then(() => {
        // Backend accessible
        clearTimeout(timeoutId);
        resolve();
      })
      .catch(() => {
        // Backend pas accessible, mais continuer quand même
        clearTimeout(timeoutId);
        console.warn('Backend non accessible, continuant...');
        resolve();
      });
  });
}

function closeSpinner() {
  const spinnerOverlay = document.getElementById('spinnerOverlay');
  
  if (!spinnerOverlay) return;

  // Ajouter la classe pour l'animation d'ouverture
  spinnerOverlay.classList.add('open');

  // Après l'animation d'ouverture (1s), supprimer l'overlay
  setTimeout(() => {
    spinnerOverlay.remove();
    // Retirer la classe pour réactiver le scroll
    document.body.classList.remove('spinner-active');
  }, 1000);
}

/**
 * Fonction pour forcer la fermeture du spinner (utile pour les tests)
 */
export function forceCloseSpinner() {
  closeSpinner();
}

/**
 * Fonction pour vérifier si le spinner est visible
 */
export function isSpinnerVisible() {
  return document.getElementById('spinnerOverlay') !== null;
}
