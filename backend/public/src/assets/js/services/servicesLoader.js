import { getServices } from "../api/endpoints.js";

// Charger les services
export async function loadServices() {
  try {
    const response = await getServices();
    const container = document.getElementById("servicesContainer");

    if (!container) return;

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
    }
  } catch (error) {
    const container = document.getElementById("servicesContainer");
    if (container) {
      container.innerHTML =
        '<p class="loading">Erreur lors du chargement des services</p>';
    }
  }
}
