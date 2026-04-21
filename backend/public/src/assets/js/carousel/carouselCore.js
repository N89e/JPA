import { createProjectCard } from "./carouselRenderer.js";
import { attachCarouselEvents } from "./carouselEvents.js";
import { updatePaginationDots, goToProjectIndex } from "./carouselPagination.js";

// Logique centrale du carrousel
export function initCarousel(projects, container) {
  if (!container) return;

  container.innerHTML = "";
  
  // Store total projects count globally for carousel state
  window.totalProjects = projects.length;
  window.currentCenterIndex = 1; // Le 2e projet (index 1) commence au centre
  window.isMobileMode = window.innerWidth < 768;

  // Créer le wrapper du carrousel
  const carouselWrapper = document.createElement("div");
  carouselWrapper.className = "projects-carousel";

  // Créer le conteneur des cartes
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "carousel-cards";

  // Créer les cartes pour chaque projet avec les positions: left, center, right
  projects.forEach((project, idx) => {
    let position = "center";
    if (idx === 0) position = "left";
    if (idx === 1) position = "center";
    if (idx > 1) position = "right";
    const projectCard = createProjectCard(project, position);
    projectCard.setAttribute("data-project-index", idx);
    cardsContainer.appendChild(projectCard);
  });

  carouselWrapper.appendChild(cardsContainer);

  // Créer les points de pagination
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "carousel-pagination";
  projects.forEach((project, idx) => {
    const dot = document.createElement("button");
    dot.className = "pagination-dot";
    if (idx === 1) dot.classList.add("active"); // Le 2e projet (index 1) est au centre
    dot.setAttribute("data-project-index", idx);
    dot.setAttribute("aria-label", `Aller au projet ${idx + 1}`);
    
    // Ajouter l'événement click pour la navigation
    dot.addEventListener("click", () => goToProjectIndex(idx));
    
    paginationContainer.appendChild(dot);
  });
  carouselWrapper.appendChild(paginationContainer);

  container.appendChild(carouselWrapper);

  // Attacher les événements
  attachCarouselEvents();
  
  // Initialiser le point actif
  setTimeout(() => {
    updatePaginationDots();
  }, 100);
}

// Recharger les projets quand la fenêtre change de taille (mode mobile ↔ desktop)
export function setupCarouselResponsive(callback) {
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== window.isMobileMode) {
        window.isMobileMode = newIsMobile;
        callback();
      }
    }, 250);
  });
}
