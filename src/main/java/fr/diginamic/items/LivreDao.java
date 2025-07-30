package fr.diginamic.items;

import jakarta.persistence.EntityManager;

public class LivreDao {
    private EntityManager em;

    public LivreDao(EntityManager em) {
        this.em = em;
    }

    public Livre findLivreById(Integer id) {
        return em.find(Livre.class, id);
    }
}

