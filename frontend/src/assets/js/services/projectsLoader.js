import { getProjects } from "../api/endpoints.js";
import { initCarousel, setupCarouselResponsive } from "../carousel/carouselCore.js";

// Charger les projets avec carrousel interactif
export async function loadProjects() {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML =
    '<p class="loading" role="status" aria-live="polite">Chargement des projets en cours...</p>';

  try {
    const response = await getProjects();

    if (response.success && response.data) {
      initCarousel(response.data, container);
    } else {
      container.innerHTML =
        '<p class="loading">Aucun projet disponible pour le moment.</p>';
    }
  } catch (error) {
    container.innerHTML =
      '<p class="loading">Erreur lors du chargement des projets</p>';
  }
}

// Initialiser le responsive du carrousel
export function initProjectsResponsive() {
  setupCarouselResponsive(loadProjects);
}
