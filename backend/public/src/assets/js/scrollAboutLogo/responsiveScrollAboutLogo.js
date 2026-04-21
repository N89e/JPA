/**
 * ResponsiveScrollAboutLogo.js
 * Responsabilité: Gère l'activation/désactivation en fonction des breakpoints
 * - Activé uniquement en-dessous de 670px
 * - Écoute les changements de taille d'écran
 */

import ScrollAboutLogoController from "./scrollAboutLogoController.js";

class ResponsiveScrollAboutLogo {
  constructor(breakpoint = 670) {
    this.breakpoint = breakpoint;
    this.controller = null;
    this.matchMedia = null;

    this.initialize();
  }

  /**
   * Initialise le gestionnaire responsif
   */
  initialize() {
    // Initialiser au chargement si on est en-dessous du breakpoint
    if (window.innerWidth <= this.breakpoint) {
      this.enableScrollAboutLogo();
    }

    // Écouter les changements de breakpoint
    this.matchMedia = window.matchMedia(`(max-width: ${this.breakpoint}px)`);
    this.matchMedia.addEventListener("change", (e) => this.onBreakpointChange(e));
  }

  /**
   * Appelé quand le breakpoint change
   */
  onBreakpointChange(event) {
    if (event.matches) {
      // On entre EN DESSOUS du breakpoint
      this.enableScrollAboutLogo();
    } else {
      // On sort AU-DESSUS du breakpoint
      this.disableScrollAboutLogo();
    }
  }

  /**
   * Active le scroll aboutLogo
   */
  enableScrollAboutLogo() {
    if (this.controller) return; // Déjà actif

    this.controller = new ScrollAboutLogoController();
  }

  /**
   * Désactive complètement le scroll aboutLogo
   */
  disableScrollAboutLogo() {
    if (!this.controller) return; // Déjà inactif

    this.controller.destroy();
    this.controller = null;
  }

  /**
   * Détruit le gestionnaire responsif
   */
  destroy() {
    if (this.controller) {
      this.controller.destroy();
      this.controller = null;
    }

    if (this.matchMedia) {
      this.matchMedia.removeEventListener("change", (e) => this.onBreakpointChange(e));
    }
  }
}

export default ResponsiveScrollAboutLogo;
