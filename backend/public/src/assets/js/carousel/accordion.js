// Gestion accordion pour les détails des projets
export function toggleAccordion(detailsElement) {
  const isActive = detailsElement.classList.contains("active");

  if (isActive) {
    // Fermer l'accordion
    detailsElement.style.maxHeight = "0px";
    detailsElement.classList.remove("active");
  } else {
    // Ouvrir l'accordion - calculer la hauteur réelle du contenu
    detailsElement.classList.add("active");
    
    // Utiliser requestAnimationFrame pour s'assurer que le DOM est rendu avant de mesurer
    requestAnimationFrame(() => {
      const height = detailsElement.scrollHeight;
      detailsElement.style.maxHeight = height + "px";
    });
  }
}
