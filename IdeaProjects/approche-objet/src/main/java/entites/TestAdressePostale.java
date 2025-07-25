package entites;


public class TestAdressePostale {
    public static void main(String[] args) {
        // Création de deux adresses postales avec toutes les informations
        AdressePostale adresse2 = new AdressePostale(42, "Rue de la République", 69002, "Lyon");

        // Affichage des deux adresses
        adresse2.affiche();
    }
}

