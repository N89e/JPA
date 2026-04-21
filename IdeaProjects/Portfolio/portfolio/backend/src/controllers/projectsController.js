// Données d'exemple des projets
const projects = [
  {
    id: 1,
    title: "Installation lavage secondaire",
    description:
      "Étude, conception et installation d’une ligne de lavage combinant logwasher et crible laveur dans la région narbonnaise, permettant de valoriser la quasi-totalité des stériles, de pérenniser le gisement et de réduire la consommation de carburant.",
    image: "src/assets/images/Image_SC113/Image_Principal.jpg",
    technologies: ["Méthode 3P", "Tekla"],
    link: "",
    date: "2024",
  },
  {
    id: 2,
    title: "Air Sphere Connect",
    description:
      "Application full-stack de gestion développée en équipe, avec pipeline CI/CD opérationnelle déployée en production.",
    image:
      "src/assets/images/Air_Sphere_Connect/Image_home_AirSphereConnect.png",
    technologies: ["Java", "Angular", "MariaDB", "Docker", "Jenkins"],
    link: "https://github.com/AirSphereConnect/AirSphereConnect",
    date: "2025",
  },
  {
    id: 3,
    title: "PEPS Formation & Accompagnement",
    description:
      "Site vitrine professionnel pour un organisme de formation et d'accompagnement, avec catalogue de prestations et formulaire de contact.",
    image: "src/assets/images/PEPS_Formation_Acc/Image_PEPS_Formations_Acc.png",
    technologies: ["React.js", "Express"],
    link: "_",
    date: "2025",
  },
];

export const getProjects = (req, res) => {
  try {
    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Erreur projects:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets",
    });
  }
};

export const getProjectById = (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.find((p) => p.id === parseInt(id));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Erreur project:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du projet",
    });
  }
};
