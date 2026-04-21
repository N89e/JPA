import { swapProjectCards } from "./carouselAnimation.js";
import { toggleAccordion } from "./accordion.js";

// Variables pour la détection des swipes
let touchStartX = 0;
let touchEndX = 0;

// Gérer les événements du carrousel avec délégation
export function attachCarouselEvents() {
  const cardsContainer = document.querySelector(".carousel-cards");
  if (!cardsContainer) return;

  // Nettoyer les anciens listeners
  cardsContainer.removeEventListener("click", handleCarouselClick);
  cardsContainer.removeEventListener("touchstart", handleTouchStart);
  cardsContainer.removeEventListener("touchend", handleTouchEnd);

  // Ajouter les listeners (click souris ET tactile)
  cardsContainer.addEventListener("click", handleCarouselClick);
  cardsContainer.addEventListener("touchstart", handleTouchStart);
  cardsContainer.addEventListener("touchend", handleTouchEnd);
}

function handleCarouselClick(event) {
  const card = event.target.closest(".project-item");
  if (!card) return;

  // Vérifier si c'est un clic sur la carte centrale (pour afficher/masquer les détails)
  if (card.classList.contains("carousel-center")) {
    const details = card.querySelector(".project-details");
    if (details && window.innerWidth < 768) {
      // Sur mobile, toggle les détails avec vrai accordion
      toggleAccordion(details);
      return;
    }
  }

  // Ne traiter que les clics sur les cartes latérales
  if (
    !card.classList.contains("carousel-left") &&
    !card.classList.contains("carousel-right")
  )
    return;

  swapProjectCards(card);
}

function handleTouchStart(event) {
  touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const difference = touchStartX - touchEndX;

  if (Math.abs(difference) < swipeThreshold) return;

  const cardsContainer = document.querySelector(".carousel-cards");
  const leftCard = cardsContainer.querySelector(".carousel-left");
  const rightCard = cardsContainer.querySelector(".carousel-right");

  if (!leftCard || !rightCard) return;

  // Swipe vers la gauche → click droit
  if (difference > 0) {
    swapProjectCards(rightCard);
  }
  // Swipe vers la droite → click gauche
  else {
    swapProjectCards(leftCard);
  }
}
