// Lazy Loading des sections - Chargement à la demande basé sur le scroll
import { loadServices } from "./services/servicesLoader.js";
import { loadProjects } from "./services/projectsLoader.js";
import { getSectionConfig } from "../../config/sectionsConfig.js";

class SectionLoader {
  constructor() {
    this.loadedSections = new Set();
    this.observer = null;
    this.init();
  }

  init() {
    // Configuration de l'Intersection Observer
    const options = {
      root: null,
      rootMargin: '50px', // Charger 50px avant d'atteindre la section
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loadedSections.has(entry.target.id)) {
          this.loadSection(entry.target.id);
          this.loadedSections.add(entry.target.id);
        }
      });
    }, options);

    // Observer toutes les sections vides
    document.querySelectorAll('[data-section]').forEach(section => {
      this.observer.observe(section);
    });

    // Charger la première section immédiatement pour UX
    const firstSection = document.querySelector('[data-section]');
    if (firstSection) {
      this.loadSection(firstSection.id);
      this.loadedSections.add(firstSection.id);
    }
  }

  async loadSection(sectionId) {
    try {
      // Vérifier si la section est activée via la config
      const sectionConfig = getSectionConfig(sectionId);
      
      if (!sectionConfig || !sectionConfig.enabled) {
        console.warn(`Section désactivée ou inexistante: ${sectionId}`);
        return;
      }

      const sectionFile = sectionConfig.file;
      if (!sectionFile) {
        console.warn(`Section file not found: ${sectionId}`);
        return;
      }

      // Récupérer le HTML de la section
      const response = await fetch(sectionFile);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const sectionElement = document.getElementById(sectionId);

      if (sectionElement) {
        // Insérer le contenu
        sectionElement.innerHTML = html;
        
        // Déclencher les événements de chargement
        this.onSectionLoaded(sectionId);
        
      }
    } catch (error) {
      console.error(`Erreur lors du chargement de la section ${sectionId}:`, error);
    }
  }

  onSectionLoaded(sectionId) {
    // Déclencher les événements spécifiques pour chaque section
    const event = new CustomEvent('section-loaded', { 
      detail: { sectionId } 
    });
    document.dispatchEvent(event);

    // Charger les données via API si applicable
    if (sectionId === 'services') {
      loadServices();
    } else if (sectionId === 'projects') {
      loadProjects();
    }
    // Le contact form est maintenant géré par contactService.js (via app.js)
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialiser le chargement des sections au démarrage du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.sectionLoader = new SectionLoader();
});

// Exporter la classe pour utilisation externe si nécessaire
export { SectionLoader };
