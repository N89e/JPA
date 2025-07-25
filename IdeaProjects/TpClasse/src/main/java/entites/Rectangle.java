package entites;

public class Rectangle {
    Point basGauche;
    int largeur;
    int hauteur;

    public Rectangle(Point basGauche, int largeur, int hauteur) {
        this.basGauche = basGauche;
        this.largeur = largeur;
        this.hauteur = hauteur;
    }

    public Point getPointBasGauche() {
        return basGauche;
    }

    public Point getPointBasDroit() {
        return new Point(basGauche.x + largeur, basGauche.y);
    }

    public Point getPointHautGauche() {
        return new Point(basGauche.x, basGauche.y + hauteur);
    }

    public Point getPointHautDroit() {
        return new Point(basGauche.x + largeur, basGauche.y + hauteur);
    }

    @Override
    public String toString() {
        return "RECT " + getPointBasGauche().toString() +
                getPointBasDroit().toString() +
                getPointHautDroit().toString() +
                getPointHautGauche().toString();
    }

    public void affiche() {
        System.out.println(this.toString());
    }
}

