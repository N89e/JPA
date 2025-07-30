package fr.diginamic.items;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.time.LocalDateTime;

@Entity
@Table(name = "EMPRUNT")
public class Emprunt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "DATE_DEBUT", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "DELAI", nullable = true)
    private Integer delai;

    @Column(name = "DATE_FIN", nullable = true)
    private LocalDateTime dateFin;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ID_CLIENT", nullable = false)
    private Client client;

    public Emprunt() {}

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }
    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Integer getDelai() {
        return delai;
    }
    public void setDelai(Integer delai) {
        this.delai = delai;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }
    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public Client getClient() {
        return client;
    }
    public void setClient(Client client) {
        this.client = client;
    }
}

