// Données d'exemple des services
const services = [
  {
    id: 1,
    title: 'Pilotage de projet',
    description: 'Je coordonne vos projets avec méthode, clarté et suivi.',
    icon: '/src/assets/images/icons_services/Icon_Pilotage.png'
  },
  {
    id: 2,
    title: 'Digitalisation',
    description: 'Je transforme vos besoins métier en outils numériques utiles et adaptés.',
    icon: '/src/assets/images/icons_services/Icon_Digitalisation.png'
  },
  {
    id: 3,
    title: 'Processus',
    description: 'J’analyse vos flux pour simplifier l’organisation et réduire les pertes.',
    icon: '/src/assets/images/icons_services/Icon_Analyse_Processus.png'
  },
  {
    id: 4,
    title: 'Applications web',
    description: 'Je crée des solutions web sur mesure pour vos besoins concrets.',
    icon: '/src/assets/images/icons_services/Icon_Application_Web.png'
  },
  {
    id: 5,
    title: 'Présence Digitale',
    description: 'Je renforce votre image avec un site web clair et moderne.',
    icon: '/src/assets/images/icons_services/Icon_Presence_Digitale.png'
  }
];

export const getServices = (req, res) => {
  try {
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Erreur services:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services'
    });
  }
};
