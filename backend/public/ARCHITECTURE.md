# Architecture Frontend - Lazy Loading des Sections

## 📋 Nouvelle Structure

Le frontend a été refactorisé pour charger les sections dynamiquement au lieu d'avoir tout dans `index.html`.

### Structure des fichiers:

```
frontend/
├── index.html                          ← Page principale (légère)
└── src/
    ├── assets/
    │   └── js/
    │       ├── app.js                 ← App principale
    │       ├── sectionLoader.js       ← ⭐ NOUVEAU - Lazy loading
    │       ├── navigation.js          ← Navigation globale
    │       └── api.js                 ← Appels API
    └── pages/
        ├── home/
        │   └── home.html              ← Section Accueil
        ├── aboutMe/
        │   └── aboutMe.html           ← Section À Propos
        ├── myServices/
        │   └── myServices.html        ← Section Services
        ├── myProjects/
        │   └── myProjects.html        ← Section Projets
        ├── contact/
        │   └── contact.html           ← Section Contact
        └── footer/
            └── footer.html            ← Footer
```

## 🎯 Fonctionnement

### 1. Index.html Léger
`index.html` contient maintenant:
- Structure HTML basique
- Navbar fixe
- Conteneurs vides avec `data-section`
- Scripts

### 2. Chargement Dynamique
Le fichier `sectionLoader.js` utilise **Intersection Observer** pour:
- Détecter quand une section devient visible (scroll)
- Charger le HTML de la section via `fetch()`
- Injecter le contenu dans le conteneur
- Initialiser les événements nécessaires

### 3. Ordre de Chargement

**Immédiatement:**
- ✓ Navbar
- ✓ Première section (Home)

**Au scroll (50px avant d'atteindre):**
- ✓ Services (charge l'API)
- ✓ Projets (charge l'API)
- ✓ Contact (initialise le formulaire)
- ✓ Footer

## 📊 Avantages

✅ **Performance**: Les sections ne se chargent que si visibles
✅ **Maintenabilité**: Chaque section dans son propre fichier
✅ **Séparation des responsabilités**: Code dédié par section
✅ **DRY**: Pas de duplication de code
✅ **Extensibilité**: Facile d'ajouter une nouvelle section

## 🔧 Comment Ajouter Une Nouvelle Section

### 1. Créer le fichier HTML
```bash
# Créer le fichier src/pages/ma-section/ma-section.html
```

### 2. Ajouter dans sectionLoader.js
```javascript
const sectionMap = {
  // ... sections existantes
  'ma-section': 'src/pages/ma-section/ma-section.html'
};
```

### 3. Ajouter dans index.html
```html
<section id="ma-section" class="section ma-section" data-section></section>
```

### 4. Initialiser si besoin
```javascript
onSectionLoaded(sectionId) {
  if (sectionId === 'ma-section') {
    window.monScript?.();
  }
}
```

## 🎨 Personnaliser le Chargement

### Modifier le délai de chargement:
```javascript
// Dans sectionLoader.js
const options = {
  root: null,
  rootMargin: '50px',  // ← Changer cette valeur
  threshold: 0.01
};
```

- `'50px'` = Charger 50px avant d'atteindre la section
- `'100px'` = Charger plus tôt
- `'0px'` = Charger exactement au scroll

### Ajouter une animation au chargement:
```javascript
// Dans sectionLoader.js, après innerHTML
sectionElement.style.opacity = '0';
setTimeout(() => {
  sectionElement.style.opacity = '1';
}, 100);
```

## 🐛 Dépannage

### Les sections ne se chargent pas?
1. Vérifier la console (F12)
2. Vérifier les chemins dans `sectionMap`
3. Vérifier que les fichiers HTML existent
4. Vérifier que `data-section` est présent sur les conteneurs

### Les API ne se chargent pas?
1. Vérifier que le backend est actif
2. Vérifier `CORS` dans le backend
3. Voir les logs: `docker-compose logs backend`

### Le formulaire ne fonctionne pas?
1. Vérifier que la section contact s'est chargée
2. Vérifier les logs du réseau (F12)
3. Vérifier les variables `.env`

## 📈 Métriques de Performance

Avant (tout dans index.html):
- Taille du fichier: ~50KB
- Temps de chargement initial: Plus lent
- Ressources chargées: Toutes

Après (lazy loading):
- Taille initiale: ~15KB
- Temps de chargement initial: ⚡ Plus rapide
- Ressources: Chargées à la demande

## 🚀 Prochaines Étapes

Pour améliorer encore:
- [ ] Ajouter un spinner de chargement
- [ ] Cache les sections chargées
- [ ] Précharger les sections proches
- [ ] Ajouter des transitions CSS
- [ ] Mesurer la performance avec Web Vitals
