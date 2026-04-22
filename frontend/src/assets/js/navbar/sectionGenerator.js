/**
 * Générateur dynamique de sections
 * Génère les éléments de section basés sur la configuration centralisée
 */

import { getEnabledSections } from "../../config/sectionsConfig.js";

export function generateSections() {
  const mainContent = document.querySelector('.app');
  
  if (!mainContent) {
    console.warn('Main content container not found');
    return;
  }

  // Récupérer les sections activées
  const enabledSections = getEnabledSections();
  
  // Générer les sections HTML
  const sectionsHTML = Object.entries(enabledSections)
    .map(([id, config]) => {
      // Footer est une balise <footer>, les autres sont des <section>
      if (id === 'footer') {
        return `<footer id="${id}" data-section></footer>`;
      }
      return `<section id="${id}" data-section role="region" aria-label="${config.label}"></section>`;
    })
    .join('\n    ');
  
  // Récupérer le contenu existant (les lignes décoratives)
  const decorativeLines = mainContent.innerHTML;
  
  // Insérer les sections générées (après les lignes décoratives)
  mainContent.innerHTML = decorativeLines + '\n    ' + sectionsHTML;
}
