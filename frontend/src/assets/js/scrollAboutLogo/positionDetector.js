/**
 * PositionDetector.js
 * Responsabilité UNIQUE: Détecte la position des icônes par rapport aux lignes de référence
 * Pas de side effects, pas de manipulation DOM directe
 */

class PositionDetector {
  constructor(lignHigh, lignLow, aboutIcons) {
    this.lignHigh = lignHigh;
    this.lignLow = lignLow;
    this.aboutIcons = aboutIcons;
  }

  /**
   * Calcule l'état d'animation pour chaque icône
   * Retourne un objet avec les transformations à appliquer
   */
  calculateAnimationState() {
    const states = [];

    // Obtenir les positions EN VIEWPORT (pas en document)
    const lignHighRect = this.lignHigh.getBoundingClientRect();
    const lignLowRect = this.lignLow.getBoundingClientRect();

    const lignHighViewport = lignHighRect.top;
    const lignLowViewport = lignLowRect.top;
    const animationZone = lignLowViewport - lignHighViewport;

    // Pour chaque about-icon
    this.aboutIcons.forEach((icon, index) => {
      const iconRect = icon.getBoundingClientRect();
      const iconViewport = iconRect.top;

      let translateX = 0;
      let translateY = 0;
      let opacity = 0;

      // Logique d'animation (comparaison en viewport)
      if (iconViewport < lignHighViewport - animationZone) {
        // AU-DESSUS de la zone d'entrée: caché en haut
        translateX = -100;
        opacity = 0;
      } else if (
        iconViewport >= lignHighViewport - animationZone &&
        iconViewport < lignHighViewport
      ) {
        // ZONE D'ANIMATION D'ENTRÉE: apparition progressive depuis le haut
        const progressPercent =
          (iconViewport - (lignHighViewport - animationZone)) / animationZone;
        translateX = -100 + progressPercent * 100; // De -100 à 0
        opacity = progressPercent * 0.5; // De 0 à 0.5
      } else if (
        iconViewport >= lignHighViewport &&
        iconViewport < lignLowViewport
      ) {
        // ZONE STABLE (high à low): visible complet
        translateX = 0;
        translateY = 0;
        opacity = 0.5;
      } else if (
        iconViewport >= lignLowViewport &&
        iconViewport < lignLowViewport + animationZone
      ) {
        // ZONE D'ANIMATION DE SORTIE: disparition vers la GAUCHE
        const progressPercent = (iconViewport - lignLowViewport) / animationZone;
        const clampedProgress = Math.min(progressPercent, 1);
        translateX = -clampedProgress * 100; // De 0 à -100 (vers la gauche)
        opacity = Math.max(0, 0.5 - clampedProgress * 0.5); // De 0.5 à 0
      } else {
        // SOUS la zone de sortie: complètement caché
        translateX = -100;
        opacity = 0;
      }

      states.push({
        icon,
        translateX,
        translateY,
        opacity,
      });
    });

    return states;
  }

  /**
   * Obtenir la position d'un élément about-icon spécifique
   */
  getPositionByIndex(index) {
    if (!this.aboutIcons[index]) return null;

    const lignHighRect = this.lignHigh.getBoundingClientRect();
    const lignHighY = lignHighRect.top + window.scrollY;

    const icon = this.aboutIcons[index];
    const iconRect = icon.getBoundingClientRect();
    const iconY = iconRect.top + window.scrollY;
    const iconCenter = iconY + iconRect.height / 2;

    const distance = iconCenter - lignHighY;
    const positionStatus = distance < 0 ? "AU-DESSUS" : "SOUS";

    return {
      distance: distance,
      status: positionStatus,
      distanceAbs: Math.abs(distance),
    };
  }

  isAbove(index) {
    const position = this.getPositionByIndex(index);
    return position ? position.distance < 0 : false;
  }

  isBelow(index) {
    const position = this.getPositionByIndex(index);
    return position ? position.distance >= 0 : false;
  }
}

export default PositionDetector;
