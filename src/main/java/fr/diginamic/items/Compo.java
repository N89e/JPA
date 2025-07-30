package fr.diginamic.items;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "COMPO")
public class Compo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ID_LIV", nullable = false)
    private Livre livre;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ID_EMP", nullable = false)
    private Emprunt emprunt;

    public Compo() {}

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public Livre getLivre() {
        return livre;
    }
    public void setLivre(Livre livre) {
        this.livre = livre;
    }

    public Emprunt getEmprunt() {
        return emprunt;
    }
    public void setEmprunt(Emprunt emprunt) {
        this.emprunt = emprunt;
    }
}

