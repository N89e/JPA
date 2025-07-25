package entites;

public class Point {
    public static void main(String[] args) {
        // Attributs à visibilité par défaut (pas de "private")
        int x;
        int y;

        // Constructeur
    public Point( int x, int y){
            this.x = x;
            this.y = y;
        }

        // Accesseurs
        public int getX () {
            return x;
        }

        public int getY () {
            return y;
        }

        // Méthode toString
        @Override //C'est une méthode automatique
        public String toString () {
            public static void main (String[]args){

            }
            return "[" + x + ";" + y + "]";
        }
    }
}
