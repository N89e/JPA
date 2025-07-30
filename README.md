# Projet Bibliothèque - Gestion des Emprunts avec JPA/Hibernate

## Description

Ce projet est une application Java qui utilise JPA (Jakarta Persistence API) avec Hibernate comme ORM pour modéliser et gérer l’activité d’emprunt d’une bibliothèque simplifiée.

La base de données implémente les tables suivantes :

- **CLIENT** : clients avec identifiant, nom et prénom
- **LIVRE** : livres avec identifiant, titre et auteur
- **EMPRUNT** : emprunts avec identifiant, date de début, délai maximum, date de fin, et client associé
- **COMPO** : table d’association entre LIVRE et EMPRUNT (relation N-N)

Le code comprend les entités JPA correspondantes, la configuration de persistence, et un exemple d’utilisation avec un DAO pour récupérer un livre par son identifiant.

---

## Prérequis

- Java 17 ou plus récent
- Maven (ou Gradle) pour la gestion des dépendances et du build
- Serveur de base de données **MariaDB** ou **MySQL** accessible localement ou à distance
- Driver JDBC MariaDB ou MySQL sur le classpath (ex. : `mariadb-java-client`)

---

## Structure du projet

- `fr.diginamic.items` : entités JPA (`Livre`, `Client`, `Emprunt`, `Compo`)
- `fr.diginamic.dao` (optionnel) : classes DAO pour accès aux entités
- `fr.diginamic.Main` : classe principale contenant le `main` d’exécution
- `src/main/resources/META-INF/persistence.xml` : configuration JPA/Hibernate

---

## Mise en place de la base de données

1. Créez une base de données nommée `bibliotheque` (ou autre, à adapter dans `persistence.xml`) :

CREATE DATABASE biblioteque;

2. Exécutez les scripts SQL pour créer les tables :
<?>
    DROP TABLE IF EXISTS CLIENT ;  
    DROP TABLE IF EXISTS LIVRE ;  
    DROP TABLE IF EXISTS EMPRUNT ;  
    DROP TABLE IF EXISTS COMPO ;  
    create table CLIENT (ID integer(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, NOM varchar(50) NOT NULL, PRENOM varchar(50) NOT NULL);  
    create table LIVRE (ID integer(10) NOT NULL PRIMARY KEY, TITRE varchar(255) NOT NULL, AUTEUR varchar(50) NOT NULL);  
    create table EMPRUNT (ID integer(10) NOT NULL PRIMARY KEY, DATE_DEBUT DATETIME NOT NULL, DATE_FIN DATETIME,DELAI integer(10), ID_CLIENT integer(10) not null);  
    CREATE TABLE COMPO (ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ID_LIV integer(10) NOT NULL, ID_EMP integer(10) NOT NULL);  
    insert into CLIENT (NOM, PRENOM) VALUES ('Brigand', 'Pierre');  
    insert into CLIENT (NOM, PRENOM) VALUES ('YU', 'Cheng');  
    insert into CLIENT (NOM, PRENOM) VALUES ('BERRAD', 'Hicham');  
    insert into LIVRE VALUES (1, 'Vingt mille lieues sous les mers', 'Jules Verne');  
    insert into LIVRE VALUES (2, 'Germinal', 'Emile Zola');  
    insert into LIVRE VALUES (3, 'Guerre et paix', 'Léon Tolstoï');  
    insert into LIVRE VALUES (4, 'Apprendre à parler aux animaux', 'Gaston Pouet');  
    insert into LIVRE VALUES (5, '1001 recettes de Cuisine', 'Jean-Pierre Coffe');  
    insert into EMPRUNT VALUES (1, '2017-11-12', '2017-11-18', 15, 1);  
    insert into EMPRUNT VALUES (2, '2017-12-08', '2017-12-23', 30, 2);  
    insert into EMPRUNT VALUES (3, '2017-12-09', '2018-01-04', 30, 3);  
    insert into EMPRUNT VALUES (4, '2018-01-03', NULL, 21, 1);  
    insert into EMPRUNT VALUES (5, '2018-01-13', NULL, 21, 3);  
    insert into COMPO VALUES (1, 1, 1);  
    insert into COMPO VALUES (2, 4, 1);  
    insert into COMPO VALUES (3, 2, 2);  
    insert into COMPO VALUES (4, 3, 2);  
    insert into COMPO VALUES (5, 1, 3);  
    insert into COMPO VALUES (6, 5, 4);  
    insert into COMPO VALUES (7, 2, 4);  
    insert into COMPO VALUES (8, 3, 5);  


3. (Optionnel) Insérez des données de test comme dans vos scripts initiaux.

---

## Configuration JPA (`persistence.xml`)

- Le fichier doit être placé impérativement dans `src/main/resources/META-INF/persistence.xml`.
- Exemple de contenu minimal :
<?>
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <persistence xmlns="https://jakarta.ee/xml/ns/persistence"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_1.xsd"
        version="3.1">  
    
        <persistence-unit name="demo">
            <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>  
            <properties>
                <property name="jakarta.persistence.jdbc.url" value="jdbc:mariadb://localhost:3306/biliotheque"/>  
                <property name="jakarta.persistence.jdbc.user" value="root"/>  
                <property name="jakarta.persistence.jdbc.password" value=""/>  
                <property name="hibernate.show_sql" value="true"/>
                <property name="hibernate.format_sql" value="true"/>
            </properties>  
        </persistence-unit>  
    </persistence>  

Dépendances Maven essentielles (extrait)

    <dependencies>
        <dependency>
            <groupId>org.hibernate.orm</groupId>
            <artifactId>hibernate-core</artifactId>
            <version>6.6.23.Final</version>
        </dependency>
        <dependency>
            <groupId>org.mariadb.jdbc</groupId>
            <artifactId>mariadb-java-client</artifactId>
            <version>3.1.2</version>
        </dependency>
        <dependency>
            <groupId>jakarta.persistence</groupId>
            <artifactId>jakarta.persistence-api</artifactId>
            <version>3.1.0</version>
        </dependency>
        <!-- Ajoutez ici d’autres dépendances utiles -->
    </dependencies>


Utilisation
Compilez et exécutez la classe principale fr.diginamic.Main.

Exemple de récupération d’un livre par son identifiant via LivreDao :

    EntityManagerFactory emf = Persistence.createEntityManagerFactory("demo");
    EntityManager em = emf.createEntityManager();
    
    LivreDao livreDao = new LivreDao(em);
    Livre livre = livreDao.findLivreById(1);
    
    System.out.println("ID: " + livre.getId());
    System.out.println("Titre: " + livre.getTitre());
    System.out.println("Auteur: " + livre.getAuteur());
    
    em.close();
    emf.close();

Vous pouvez accéder directement aux autres entités via EntityManager.find().

Réalisé par Nuno ESTEVES