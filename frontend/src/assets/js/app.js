// Point d'entrée unique de l'application
import { initProjectsResponsive } from "./services/projectsLoader.js";
import { initContactForm } from "./services/contactService.js";
import { initScrollAboutLogo } from "./scrollAboutLogo/scrollAboutLogo.js";
import { initNavbar, initCardAnimations } from "./navbar/navbar.js";
import { initSpinner } from "./spinner.js";
import { SECTIONS_CONFIG, getNavSections } from "../../config/sectionsConfig.js";

// Initialiser le spinner de chargement au plus tôt
initSpinner();

// Initialiser l'application au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  
  // 1️⃣ Masquer/Afficher les sections basées sur la config
  Object.entries(SECTIONS_CONFIG).forEach(([sectionId, config]) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      if (!config.enabled) {
        sectionElement.style.display = 'none';
      }
    }
  });

  // 2️⃣ Masquer/Afficher les nav items basées sur la config
  const navItems = document.querySelectorAll('.nav-item');
  const enabledNavSections = getNavSections().map(s => s.id);
  
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      const sectionId = link.getAttribute('href').replace('#', '');
      if (!enabledNavSections.includes(sectionId)) {
        item.style.display = 'none';
      }
    }
  });

  // 3️⃣ Initialiser la navbar
  initNavbar();

  // 4️⃣ Initialiser les animations des cartes
  initCardAnimations();

  // 5️⃣ Initialiser le responsive du carrousel
  // (Services et Projets seront chargés par sectionLoader au besoin)
  initProjectsResponsive();

  // 6️⃣ Initialiser le formulaire de contact
  initContactForm();

  // 7️⃣ Initialiser le scroll aboutLogo
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
