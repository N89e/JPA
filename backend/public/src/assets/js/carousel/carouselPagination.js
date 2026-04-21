// Gestion de la pagination du carrousel

export function updatePaginationDots() {
  const centerCard = document.querySelector(".carousel-center");
  if (!centerCard) return;

  const centerIndex = parseInt(centerCard.getAttribute("data-project-index"), 10);

  const dots = document.querySelectorAll(".pagination-dot");
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  // Mettre à jour le point correspondant à la card au centre
  const activeDot = document.querySelector(`.pagination-dot[data-project-index="${centerIndex}"]`);
  if (activeDot) {
    activeDot.classList.add("active");
  }
}

// Écouter l'événement de fin d'animation du carrousel
document.addEventListener("carousel-animation-end", () => {
  updatePaginationDots();
});

// Naviguer vers un projet spécifique via les points de pagination
export async function goToProjectIndex(targetIndex) {
  // Import dynamique pour éviter la circularité
  const { swapProjectCards } = await import('./carouselAnimation.js');
  
  const allCards = Array.from(document.querySelectorAll(".project-item"));
  const centerCard = document.querySelector(".carousel-center");

  if (!centerCard || allCards.length === 0) return;

  // Obtenir l'index actuel du centre
  const currentCenterIndex = parseInt(centerCard.getAttribute("data-project-index"), 10);

  if (currentCenterIndex === targetIndex) return; // Déjà au bon endroit

  // Calculer le nombre de rotations nécessaires
  let stepsNeeded = (targetIndex - currentCenterIndex + window.totalProjects) % window.totalProjects;

  // Effectuer les rotations
  const performRotation = () => {
    if (stepsNeeded === 0) {
      updatePaginationDots();
      return;
    }

    const rightCard = document.querySelector(".carousel-right");
    swapProjectCards(rightCard);
    stepsNeeded--;

    // Attendre un peu avant la prochaine rotation
    setTimeout(performRotation, 600);
  };

  performRotation();
}
