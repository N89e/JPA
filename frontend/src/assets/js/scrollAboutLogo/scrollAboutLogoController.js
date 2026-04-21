/**
 * ScrollAboutLogoController.js
 * Responsabilité: Orchestration du système scroll aboutLogo
 * - Gère le cycle de vie (init/destroy)
 * - Gère les listeners (scroll, resize, breakpoint)
 * - Attend le chargement des éléments DOM
 */

import PositionDetector from "./positionDetector.js";
import ScrollAnimator from "./scrollAnimator.js";

class ScrollAboutLogoController {
  constructor() {
    this.lignHigh = null;
    this.lignLow = null;
    this.aboutIcons = [];
    this.positionDetector = null;
    this.scrollAnimator = null;
    this.isInitialized = false;
    this.retryCount = 0;
    this.maxRetries = 50; // Max 5 secondes (50 * 100ms)
    this.scrollHandler = null;

    this.waitForElements();
  }

  /**
   * Attend que les éléments DOM se chargent (notamment pour les sections dynamiques)
   */
  waitForElements() {
    const checkInterval = setInterval(() => {
      this.lignHigh = document.querySelector(".lign-high");
      this.lignLow = document.querySelector(".lign-low");
      this.aboutIcons = document.querySelectorAll(".about-icon");

      if (this.lignHigh && this.lignLow && this.aboutIcons.length > 0) {
        clearInterval(checkInterval);
        this.initializeSystem();
      } else {
        this.retryCount++;
        if (this.retryCount >= this.maxRetries) {
          console.error("❌ ScrollAboutLogo: Elements not found after retries");
          clearInterval(checkInterval);
        }
      }
    }, 100);
  }

  /**
   * Initialise le système une fois que tous les éléments sont disponibles
   */
  initializeSystem() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Créer les instances
    this.positionDetector = new PositionDetector(
      this.lignHigh,
      this.lignLow,
      this.aboutIcons
    );
    this.scrollAnimator = new ScrollAnimator(this.aboutIcons);

    // Initialiser l'animateur
    this.scrollAnimator.initialize();

    // Créer et ajouter le scroll handler
    this.scrollHandler = () => this.onScroll();
    window.addEventListener("scroll", this.scrollHandler);

    // Première détection au chargement
    this.onScroll();

  }

  /**
   * Appelé à chaque événement scroll
   */
  onScroll() {
    if (!this.positionDetector || !this.scrollAnimator) return;

    const animationStates = this.positionDetector.calculateAnimationState();
    this.scrollAnimator.applyAnimationStates(animationStates);
  }

  /**
   * Détruit complètement le contrôleur
   */
  destroy() {
    if (!this.isInitialized) return;

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
    }

    if (this.scrollAnimator) {
      this.scrollAnimator.destroy();
    }

    this.isInitialized = false;
    this.positionDetector = null;
    this.scrollAnimator = null;

    console.log("✅ ScrollAboutLogo destroyed");
  }
}

export default ScrollAboutLogoController;
