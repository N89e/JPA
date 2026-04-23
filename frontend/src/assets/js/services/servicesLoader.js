import { getServices } from "../api/endpoints.js";

// Charger les services
export async function loadServices() {
  const container = document.getElementById("servicesContainer");
  if (!container) return;

  container.innerHTML =
    '<p class="loading" role="status" aria-live="polite">Chargement des services en cours...</p>';

  try {
    const response = await getServices();

    if (response.success && response.data) {
      container.innerHTML = response.data
        .map(
          (service) => `
        <div class="service-card">
          <div class="service-icon">
            <img src="${service.icon}" alt="${service.title}">
          </div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          ${
            service.features
              ? `
            <ul class="service-features">
              ${service.features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
          `
              : ""
          }
        </div>
      `,
        )
        .join("");
    } else {
      container.innerHTML =
        '<p class="loading">Aucun service disponible pour le moment.</p>';
    }
  } catch (error) {
    container.innerHTML =
      '<p class="loading">Erreur lors du chargement des services</p>';
  }
}
