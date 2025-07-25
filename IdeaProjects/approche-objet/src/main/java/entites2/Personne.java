package entites2;

import entites.AdressePostale;

public class Personne {
    String nom;
    String prenom;
    AdressePostale adresse;

    // Constructeur sans adresse
    public Personne(String nom, String prenom) {
        this.nom = nom;
        this.prenom = prenom;
    }

    // Constructeur avec adresse
    public Personne(String nom, String prenom, AdressePostale adresse) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
    }

    // 1. Affiche prénom + nom (nom en majuscules)
    public void afficherNomPrenomMajuscule() {
        System.out.println(this.prenom + " " + this.nom.toUpperCase());
    }

    // 2. Modifier le nom
    public void modifierNom(String nouveauNom) {
        this.nom = nouveauNom;
    }

    // 3. Modifier le prénom
    public void modifierPrenom(String nouveauPrenom) {
        this.prenom = nouveauPrenom;
    }

    // 4. Modifier l'adresse
    public void modifierAdresse(AdressePostale nouvelleAdresse) {
        this.adresse = nouvelleAdresse;
    }

    // 5. Retourner le nom
    public String getNom() {
        return this.nom;
    }

    // 6. Retourner le prénom
    public String getPrenom() {
        return this.prenom;
    }

    // 7. Retourner l'adresse
    public AdressePostale getAdresse() {
        return this.adresse;
    }

    @Override
    public String toString() {
        if (adresse != null) {
            return prenom + " " + nom + " - " + adresse.toString();
        } else {
            return prenom + " " + nom;
        }
    }

    public void affiche() {
        System.out.println(this.toString());
    }
}
