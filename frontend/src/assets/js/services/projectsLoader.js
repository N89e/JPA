import { getProjects } from "../api/endpoints.js";
import { initCarousel, setupCarouselResponsive } from "../carousel/carouselCore.js";

// Charger les projets avec carrousel interactif
export async function loadProjects() {
  try {
    const response = await getProjects();
    const container = document.getElementById("projectsContainer");

    if (!container) return;

    if (response.success && response.data) {
      initCarousel(response.data, container);
    }
  } catch (error) {
    const container = document.getElementById("projectsContainer");
    if (container) {
      container.innerHTML =
        '<p class="loading">Erreur lors du chargement des projets</p>';
    }
  }
}

// Initialiser le responsive du carrousel
export function initProjectsResponsive() {
  setupCarouselResponsive(loadProjects);
}
