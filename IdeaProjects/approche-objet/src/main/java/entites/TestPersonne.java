package entites;

import entites2.Personne;

public class TestPersonne {
    public static void main(String[] args) {

        // 1. Utilise le constructeur avec nom et prénom
        Personne p1 = new Personne("Durand", "Luc");

        // 2. Création d'une AdressePostale
        AdressePostale adresse = new AdressePostale(25, "Rue Victor Hugo", 69000, "Lyon");

        // 3. Modification de l'adresse de la Personne
        p1.modifierAdresse(adresse);

        // 4. Affichage des infos
        p1.affiche();

        // 5. Test affichage nom/prénom (nom en majuscules)
        p1.afficherNomPrenomMajuscule();

        // 6. Modification nom et prénom
        p1.modifierNom("Martin");
        p1.modifierPrenom("Sophie");

        // 7. Affichage après modification
        p1.affiche();

        // 8. Test getters
        System.out.println("Nom : " + p1.getNom());
        System.out.println("Prénom : " + p1.getPrenom());
        System.out.println("Adresse : " + p1.getAdresse());
    }
}
