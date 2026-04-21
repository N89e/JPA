/**
 * scrollAboutLogo.js
 * Point d'entrée refactorisé - Simple wrapper d'initialisation
 * Les responsabilités sont maintenant séparées dans d'autres modules
 */

import ResponsiveScrollAboutLogo from "./responsiveScrollAboutLogo.js";

let responsiveScrollAboutLogo = null;

/**
 * Initialise le gestionnaire responsif du scroll aboutLogo
 * À appeler une seule fois au démarrage de l'application
 */
export function initScrollAboutLogo() {
  if (responsiveScrollAboutLogo) return; // Déjà initialisé

  responsiveScrollAboutLogo = new ResponsiveScrollAboutLogo(670);
  window.responsiveScrollAboutLogo = responsiveScrollAboutLogo;

}
