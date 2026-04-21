# 📚 Guide d'ajout de projets

## Comment ajouter un nouveau projet au carrousel

### Étape 1: Ajouter le projet dans l'API backend

**Fichier:** `backend/src/controllers/projectsController.js`

```javascript
// Cherchez le tableau `projects` et ajoutez un nouvel objet:

{
  id: 4,                                           // ID unique
  title: 'Titre de votre projet',                 // Titre du projet
  description: 'Description du projet...',        // Description détaillée
  image: 'src/assets/images/Dossier/image.png',   // Chemin vers l'image
  technologies: ['Tech1', 'Tech2', 'Tech3'],      // Array de technologies
  link: 'https://github.com/votre-projet',        // Lien externe
  date: '2025'                                    // Année du projet
}
```

### Étape 2: Ajouter l'image du projet

1. Créer un dossier pour votre projet dans: `frontend/src/assets/images/`
   ```
   frontend/src/assets/images/
   ├── Air_Sphere_Connect/
   ├── Image_SC113/
   ├── PEPs_Formation/
   └── MonNouveauProjet/     ← NOUVEAU DOSSIER
       ├── image_principale.png
       └── autre_image.png
   ```

2. Placer votre image principale dans ce dossier

### Étape 3: Mettre à jour le contrôleur

Exemple complet:

```javascript
const projects = [
  {
    id: 1,
    title: 'Air Sphere Connect',
    description: 'Application full-stack de gestion développée en équipe, avec pipeline CI/CD opérationnelle déployée en production.',
    image: 'src/assets/images/Air_Sphere_Connect/Image_home_Air_Sphere_Connect.png',
    technologies: ['Java', 'Angular', 'MariaDB', 'Docker', 'Jenkins'],
    link: 'https://github.com/AirSphereConnect/AirSphereConnect',
    date: '2025'
  },
  // ... autres projets ...
  {
    id: 4,
    title: 'Mon Nouveau Projet',
    description: 'Ceci est mon nouveau projet incroyable qui fait plein de trucs cool.',
    image: 'src/assets/images/MonNouveauProjet/image_principale.png',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    link: 'https://github.com/username/nouveau-projet',
    date: '2025'
  }
];
```

### Variables disponibles pour chaque projet

| Variable | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `id` | Number | ✅ Oui | ID unique, doit être différent des autres |
| `title` | String | ✅ Oui | Titre du projet |
| `description` | String | ✅ Oui | Description complète (peut être longue) |
| `image` | String | ✅ Oui | Chemin relatif vers l'image |
| `technologies` | Array | ✅ Oui | Array de strings (ex: ['React', 'Node']) |
| `link` | String | ❌ Non | URL du projet (laisser vide si interne) |
| `date` | String | ✅ Oui | Année de création (ex: '2025') |

### Étapes après modification

1. **Sauvegarder le fichier** `projectsController.js`
2. **Redémarrer le backend** (CTRL+C et relancer)
3. **Rafraîchir le navigateur** (F5)
4. **Naviguer dans le carrousel** pour voir le nouveau projet

---

## 🚨 Pièges courants

### ❌ L'image ne s'affiche pas
- **Cause:** Le chemin de l'image est incorrect
- **Solution:** Vérifier que le fichier existe bien au chemin spécifié

### ❌ Le nouveau projet n'apparaît pas
- **Cause:** Le serveur backend n'a pas été redémarré
- **Solution:** Arrêter (CTRL+C) et relancer `npm start` dans le dossier backend

### ❌ Erreur "Cannot read property"
- **Cause:** Une propriété obligatoire manque (id, title, etc.)
- **Solution:** Vérifier que toutes les variables obligatoires sont présentes

### ❌ L'ID du projet dupliqué
- **Cause:** Deux projets ont le même ID
- **Solution:** S'assurer que chaque `id` est unique

---

## 📋 Exemple complet pour ajouter un projet

**Je veux ajouter un projet "Portfolio Personal" créé en 2025 avec React et Node.js**

### 1. Créer le dossier
```
frontend/src/assets/images/Portfolio_Personal/
```

### 2. Y mettre une image
```
frontend/src/assets/images/Portfolio_Personal/image-principale.png
```

### 3. Ajouter à `projectsController.js`
```javascript
{
  id: 4,
  title: 'Portfolio Personnel',
  description: 'Un portfolio personnel pour showcaser mes projets et compétences. Développé avec les meilleures pratiques du web moderne.',
  image: 'src/assets/images/Portfolio_Personal/image-principale.png',
  technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'CSS Modern'],
  link: 'https://github.com/username/portfolio-personal',
  date: '2025'
}
```

### 4. Redémarrer et tester
```bash
# Arrêter le backend (CTRL+C)
# Dans le dossier backend:
npm start

# Rafraîchir le navigateur
```

---

## 🎨 Bonnes pratiques

### ✅ À faire
- Utiliser des descriptions claires et concises
- Lister les technologies principales utilisées
- Incluire un lien GitHub/Live si disponible
- Utiliser des images de 1200x800px ou plus
- Utiliser des noms de dossier descriptifs

### ❌ À ne pas faire
- Ne pas laisser les variables vides (sauf `link`)
- Ne pas dupliquer les IDs
- Ne pas utiliser des images trop lourdes (> 2MB)
- Ne pas oublier de redémarrer le serveur après modification

---

## 🔄 Supprimer un projet

Pour supprimer un projet, simplement **le supprimer du tableau** dans `projectsController.js`:

```javascript
const projects = [
  // {id: 1, ...} ← SUPPRIMER CETTE LIGNE ENTIÈREMENT
  {id: 2, ...},
  {id: 3, ...}
  // Projet 1 supprimé !
];
```

**N'oubliez pas de redémarrer le backend !**

---

## 📊 Vérifier les projets chargés

Ouvrez les **DevTools** (F12) et allez dans l'onglet **Console**.

Tapez:
```javascript
fetch('http://localhost:5000/api/projects')
  .then(r => r.json())
  .then(data => console.table(data.data))
```

Cela affichera tous les projets dans un tableau bien formaté.

---

## 🎯 Limite de projets

Il n'y a **aucune limite** au nombre de projets !

Le carrousel s'adaptera automatiquement et créera autant d'indicateurs que nécessaire.

Cependant, pour une meilleure UX, je recommande:
- **Minimum 2 projets** (sinon le carrousel n'a pas d'intérêt)
- **Idéal: 3-5 projets** (facile à naviguer)
- **Maximum: Pas de limite technique**

---

**Questions ? Consultez le fichier `CAROUSEL_3D_GUIDE.md` pour plus de détails ! 🚀**
