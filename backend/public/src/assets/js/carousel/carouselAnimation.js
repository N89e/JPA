// Animations du carrousel

export function swapProjectCards(clickedCard) {
  const cardsContainer = document.querySelector(".carousel-cards");
  const allCards = Array.from(cardsContainer.querySelectorAll(".project-item"));

  if (allCards.length < 3) return;

  // Trouver la carte au centre et identifier gauche/droite
  const centerCard = allCards.find((c) =>
    c.classList.contains("carousel-center"),
  );
  const leftCard = allCards.find((c) => c.classList.contains("carousel-left"));
  const rightCard = allCards.find((c) =>
    c.classList.contains("carousel-right"),
  );

  if (!centerCard || !leftCard || !rightCard) return;

  // Déterminer d'où vient le click
  const isClickedLeft = clickedCard === leftCard;

  // NETTOYER TOUTES LES ANIMATIONS EN COURS
  allCards.forEach((card) => {
    card.classList.remove(
      "slide-left-to-center",
      "slide-right-to-center",
      "slide-center-to-left",
      "slide-center-to-right",
    );
  });

  // Réinitialiser l'accordion de la carte qui quitte le centre DÈS MAINTENANT
  const detailsLeavingCenter = centerCard.querySelector(".project-details");
  if (detailsLeavingCenter) {
    detailsLeavingCenter.classList.remove("active");
    detailsLeavingCenter.style.maxHeight = "0px";
  }

  // Ajouter la classe d'animation à la carte cliquée
  if (isClickedLeft) {
    centerCard.classList.add("slide-center-to-left");
    leftCard.classList.add("slide-left-to-center");
  } else {
    centerCard.classList.add("slide-center-to-right");
    rightCard.classList.add("slide-right-to-center");
  }

  // Attendre que le navigateur enregistre l'animation, puis faire les changements de positionnement
  requestAnimationFrame(() => {
    // Définir le nouvel ordre IDENTIQUE pour les deux cas
    const newOrder = isClickedLeft
      ? [rightCard, leftCard, centerCard]
      : [centerCard, rightCard, leftCard];

    // Réorganiser le DOM de manière SYMÉTRIQUE
    newOrder.forEach((card) => cardsContainer.appendChild(card));

    // Puis appliquer les changements de classe
    if (isClickedLeft) {
      leftCard.classList.remove("carousel-left");
      leftCard.classList.add("carousel-center");

      centerCard.classList.remove("carousel-center");
      centerCard.classList.add("carousel-right");

      rightCard.classList.remove("carousel-right");
      rightCard.classList.add("carousel-left");
    } else {
      rightCard.classList.remove("carousel-right");
      rightCard.classList.add("carousel-center");

      centerCard.classList.remove("carousel-center");
      centerCard.classList.add("carousel-left");

      leftCard.classList.remove("carousel-left");
      leftCard.classList.add("carousel-right");
    }
  });

  // Retirer la classe d'animation après la fin de l'animation
  clickedCard.addEventListener(
    "animationend",
    () => {
      clickedCard.classList.remove(
        isClickedLeft ? "slide-left-to-center" : "slide-right-to-center",
      );
    },
    { once: true },
  );

  centerCard.addEventListener(
    "animationend",
    () => {
      centerCard.classList.remove(
        isClickedLeft ? "slide-center-to-left" : "slide-center-to-right",
      );
      
      // Émettre un événement personnalisé pour notifier la pagination
      const event = new CustomEvent("carousel-animation-end", {
        detail: { animationType: "swap" }
      });
      document.dispatchEvent(event);
      
      // Réinitialiser les détails de la nouvelle carte au centre (au cas où)
      const newCenterCard = document.querySelector(".carousel-center");
      if (newCenterCard) {
        const details = newCenterCard.querySelector(".project-details");
        if (details) {
          details.classList.remove("active");
          details.style.maxHeight = "0px";
        }
      }
    },
    { once: true },
  );
}
