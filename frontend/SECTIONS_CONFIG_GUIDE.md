# 🎛️ Guide de Configuration Centralisée des Sections

## Vue d'ensemble

Vous pouvez maintenant **contrôler toutes les sections de votre portfolio à partir d'un seul fichier** !

## Fichier de Configuration

📁 **Location:** `frontend/src/config/sectionsConfig.js`

C'est LE seul endroit où vous devez faire vos changements.

## Comment ça fonctionne

### Structure du fichier config

```javascript
export const SECTIONS_CONFIG = {
  home: {
    enabled: true,           // ← Active/Désactive la section
    label: 'Accueil',        // ← Label affiché dans la nav
    file: 'src/pages/home/home.html',  // ← Fichier à charger
    showInNav: true          // ← Afficher dans la navbar
  },
  services: {
    enabled: true,           // ← Changez à false pour masquer
    label: 'Services',
    file: 'src/pages/myServices/myServices.html',
    showInNav: true
  },
  // ... autres sections
};
```

## Exemples d'utilisation

### ✅ Masquer la section Services

```javascript
services: {
  enabled: false,  // ← La section n'apparaît plus ni dans la nav ni dans le DOM
  label: 'Services',
  file: 'src/pages/myServices/myServices.html',
  showInNav: true
},
```

### ✅ Masquer du nav mais garder la section

```javascript
projects: {
  enabled: true,     // ← La section existe et peut être chargée
  label: 'Projets',
  file: 'src/pages/myProjects/myProjects.html',
  showInNav: false   // ← Mais n'apparaît pas dans la navbar
},
```

### ✅ Changer le label de la nav

```javascript
about: {
  enabled: true,
  label: 'À Propos (Mon Profil)',  // ← Le texte dans la nav changera
  file: 'src/pages/aboutMe/aboutMe.html',
  showInNav: true
},
```

## Qu'est-ce qui s'adapte automatiquement ?

Une fois que vous modifiez `sectionsConfig.js`, voici ce qui change automatiquement :

1. ✅ **Navigation** - Les items s'ajustent automatiquement
2. ✅ **Sections HTML** - Seules les sections activées sont créées dans le DOM
3. ✅ **Chargement** - Le `SectionLoader` ne charge que les sections activées
4. ✅ **Routing** - Les anchors (#home, #services, etc.) fonctionnent seulement si activées

## Fichiers impliqués

Ces fichiers utilisent la configuration mais **vous ne devez pas les modifier** :

- 📄 `frontend/src/config/sectionsConfig.js` - **← À modifier uniquement**
- 📄 `frontend/src/assets/js/navbar/navGenerator.js` - Génère la navbar (généré automatiquement)
- 📄 `frontend/src/assets/js/navbar/sectionGenerator.js` - Génère les sections (généré automatiquement)
- 📄 `frontend/src/assets/js/sectionLoader.js` - Charge les contenus (utilise la config)
- 📄 `frontend/src/assets/js/app.js` - Point d'entrée (utilise les générateurs)

## Workflow

1. 🔧 Modifiez `sectionsConfig.js`
2. 💾 Sauvegardez
3. 🔄 Rechargez la page (Ctrl+F5)
4. ✨ Tout s'adapte !

## ⚠️ Points importants

- **Toujours modifier `sectionsConfig.js`** - C'est l'unique source de vérité
- **Ne pas modifier les sections dans index.html** - Elles sont générées dynamiquement
- **Ne pas modifier la navbar dans index.html** - Elle est générée dynamiquement
- **Hard refresh si changements visibles** - Utilisez Ctrl+F5 pour forcer le rechargement

## Exemple complet : Désactiver Services

### Avant (❌ Ancienne méthode)
- Modifier la nav dans index.html
- Modifier la section dans index.html
- Gérer le sectionMap dans sectionLoader.js
- 3 endroits différents à modifier 😞

### Après (✅ Nouvelle méthode)
```javascript
// File: frontend/src/config/sectionsConfig.js
services: {
  enabled: false,  // ← Un seul changement !
  label: 'Services',
  file: 'src/pages/myServices/myServices.html',
  showInNav: true
}
```

Fait ! ✨
