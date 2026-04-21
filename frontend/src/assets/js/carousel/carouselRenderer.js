// Créer une carte de projet
export function createProjectCard(project, position = "side") {
  const techHTML = project.technologies
    .map((tech) => `<span class="tech-tag">${tech}</span>`)
    .join("");

  const card = document.createElement("div");
  card.id = `project-${project.id}`;
  card.className = `project-item carousel-${position === "center" ? "center" : position === "left" ? "left" : "right"}`;
  card.setAttribute("data-project-id", project.id);
  
  // Structure différente selon le mode mobile
  if (window.isMobileMode) {
    // Mode mobile : TOUS les cartes ont détails séparés dans un accordion (affiché seulement au centre)
    card.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}">
        ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="Voir le projet"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : ""}
      </div>
      <div class="project-header">
        <div class="project-info">
          <div class="project-title">
            <h3>${project.title}</h3>
          </div>
        </div>
      </div>
      <div class="project-details">
        <div class="project-date">Année ${project.date}</div>
        <p>${project.description}</p>
        <div class="project-tech">${techHTML}</div>
      </div>
    `;
  } else {
    // Mode desktop : détails visibles dans project-info
    card.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}">
        ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="Voir le projet"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : ""}
      </div>
      <div class="project-header">
        <div class="project-info">
          <div class="project-title">
            <h3>${project.title}</h3>
          </div>
          <p>${project.description}</p>
          <div class="project-tech">${techHTML}</div>
        </div>
      </div>
    `;
  }

  return card;
}
