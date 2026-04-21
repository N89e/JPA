/**
 * ScrollAnimator.js
 * Responsabilité UNIQUE: Applique les animations CSS aux icônes
 * Ne fait que manipuler le DOM visual, pas de logique métier
 */

class ScrollAnimator {
  constructor(aboutIcons) {
    this.aboutIcons = aboutIcons;
    this.scrollHandler = null;
    this.isActive = false;
  }

  /**
   * Initialise l'animateur et ajoute les listeners
   */
  initialize() {
    if (this.isActive) return;
    this.isActive = true;

    // Ajouter transition CSS
    this.aboutIcons.forEach((icon) => {
      icon.style.transition = "transform 0.1s ease-out, opacity 0.1s ease-out";
    });
  }

  /**
   * Applique les états d'animation calculés aux éléments DOM
   */
  applyAnimationStates(animationStates) {
    animationStates.forEach(({ icon, translateX, translateY, opacity }) => {
      icon.style.transform = `translateX(${translateX}%) translateY(${translateY}%)`;
      icon.style.opacity = opacity;
      icon.style.visibility = opacity > 0 ? "visible" : "hidden";
      icon.style.pointerEvents = opacity > 0 ? "auto" : "none";
    });
  }

  /**
   * Réinitialise les styles à leur état par défaut
   */
  resetStyles() {
    this.aboutIcons.forEach((icon) => {
      icon.style.transform = "none";
      icon.style.opacity = "1";
      icon.style.visibility = "visible";
      icon.style.pointerEvents = "auto";
      icon.style.transition = "none";
    });
  }

  /**
   * Désactive l'animateur et nettoie les styles
   */
  destroy() {
    if (!this.isActive) return;

    this.resetStyles();
    this.isActive = false;
  }
}

export default ScrollAnimator;
