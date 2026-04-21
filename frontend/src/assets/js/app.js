// Point d'entrée unique de l'application
import { initProjectsResponsive } from "./services/projectsLoader.js";
import { initContactForm } from "./services/contactService.js";
import { initScrollAboutLogo } from "./scrollAboutLogo/scrollAboutLogo.js";
import { initNavbar, initCardAnimations } from "./navbar/navbar.js";

// Initialiser l'application au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  
  // Initialiser la navbar
  initNavbar();

  // Initialiser les animations des cartes
  initCardAnimations();

  // Initialiser le responsive du carrousel
  // (Services et Projets seront chargés par sectionLoader au besoin)
  initProjectsResponsive();

  // Initialiser le formulaire de contact
  initContactForm();

  // Initialiser le scroll aboutLogo
  initScrollAboutLogo();
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
});

// Gestion des promesses rejetées non gérées
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
});
