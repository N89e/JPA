/**
 * Configuration centralisée des sections du portfolio
 * Modifiez ici pour afficher/masquer les sections
 * Tout le reste s'adapte automatiquement
 */

export const SECTIONS_CONFIG = {
  home: {
    enabled: true,
    label: 'Accueil',
    file: 'src/pages/home/home.html',
    showInNav: true
  },
  about: {
    enabled: true,
    label: 'À Propos',
    file: 'src/pages/aboutMe/aboutMe.html',
    showInNav: true
  },
  services: {
    enabled: true,
    label: 'Services',
    file: 'src/pages/myServices/myServices.html',
    showInNav: true
  },
  projects: {
    enabled: true,
    label: 'Projets',
    file: 'src/pages/myProjects/myProjects.html',
    showInNav: true
  },
  contact: {
    enabled: true,
    label: 'Contact',
    file: 'src/pages/contact/contact.html',
    showInNav: true
  },
  footer: {
    enabled: true,
    label: 'Footer',
    file: 'src/pages/footer/footer.html',
    showInNav: false  // Le footer ne s'affiche pas dans la nav
  }
};

/**
 * Récupère la liste des sections activées
 */
export function getEnabledSections() {
  return Object.entries(SECTIONS_CONFIG)
    .filter(([_, config]) => config.enabled)
    .reduce((acc, [key, config]) => {
      acc[key] = config;
      return acc;
    }, {});
}

/**
 * Récupère les sections à afficher dans la nav
 */
export function getNavSections() {
  return Object.entries(SECTIONS_CONFIG)
    .filter(([_, config]) => config.enabled && config.showInNav)
    .map(([key, config]) => ({ id: key, ...config }));
}

/**
 * Récupère la configuration d'une section
 */
export function getSectionConfig(sectionId) {
  return SECTIONS_CONFIG[sectionId];
}
