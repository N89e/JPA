package fr.diginamic;

import fr.diginamic.items.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class Main {

    public static void main(String[] args) {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("demo");
        EntityManager em = emf.createEntityManager();

        try {
            LivreDao livreDao = new LivreDao(em);
            Livre livre = livreDao.findLivreById(1);
            System.out.println("Livre trouvé :");
            System.out.println("ID: " + livre.getId());
            System.out.println("Titre: " + livre.getTitre());
            System.out.println("Auteur: " + livre.getAuteur());

            // Récupérer un client
            Client client = em.find(Client.class, 1);
            if (client != null) {
                System.out.println("\nClient trouvé :");
                System.out.println("ID: " + client.getId());
                System.out.println("Nom: " + client.getNom());
                System.out.println("Prénom: " + client.getPrenom());
            }

            // Récupérer un emprunt
            Emprunt emprunt = em.find(Emprunt.class, 1);
            if (emprunt != null) {
                System.out.println("\nEmprunt trouvé :");
                System.out.println("ID: " + emprunt.getId());
                System.out.println("Date début: " + emprunt.getDateDebut());
                System.out.println("Délai: " + emprunt.getDelai());
                System.out.println("Date fin: " + emprunt.getDateFin());
                System.out.println("Client lié: " + emprunt.getClient().getNom() + " " + emprunt.getClient().getPrenom());
            }

            // Récupérer une association Compo
            Compo compo = em.find(Compo.class, 1);
            if (compo != null) {
                System.out.println("\nCOMPO trouvé :");
                System.out.println("ID: " + compo.getId());
                System.out.println("Livre associé: " + compo.getLivre().getTitre());
                System.out.println("Emprunt associé ID: " + compo.getEmprunt().getId());
            }

        } finally {
            em.close();
            emf.close();
        }
    }
}
