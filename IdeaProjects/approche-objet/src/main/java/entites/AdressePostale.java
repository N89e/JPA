package entites;

public class AdressePostale {
    int numeroRue;
    String libelleRue;
    int codePostal;
    String ville;

    // Constructeur
    public AdressePostale(int numeroRue, String libelleRue, int codePostal, String ville) {
        this.numeroRue = numeroRue;
        this.libelleRue = libelleRue;
        this.codePostal = codePostal;
        this.ville = ville;
    }

    // Méthode toString pour affichage
    @Override
    public String toString() {
        return numeroRue + " " + libelleRue + ", " + codePostal + " " + ville;
    }

    // Méthode d'affichage
    public void affiche() {
        System.out.println(this.toString());
    }
}

