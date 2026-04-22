/**
 * Générateur dynamique de navigation
 * Génère les éléments de nav basés sur la configuration centralisée
 */

import { getNavSections } from "../../config/sectionsConfig.js";

export function generateNavItems() {
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (!navbarMenu) {
    console.warn('Navbar menu not found');
    return;
  }

  // Récupérer les sections à afficher dans la nav
  const navSections = getNavSections();
  
  // Générer les items de nav
  const navItems = navSections
    .map(section => `
      <li class="nav-item">
        <a href="#${section.id}" class="nav-link">${section.label}</a>
      </li>
    `)
    .join('');
  
  // Insérer les items générés
  navbarMenu.innerHTML = navItems;
}
