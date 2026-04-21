# Configuration du Frontend

Application SPA (Single Page Application) en HTML5/CSS3/JavaScript vanilla.

## Structure

- `index.html` - Page principale contenant toutes les sections
- `src/assets/css/` - Feuilles de style (style.css + responsive.css)
- `src/assets/js/` - Scripts JavaScript (app.js, navigation.js, api.js)
- `src/assets/images/` - Images et ressources

## Fonctionnalités

- Navigation avec menu responsive
- Sections: Accueil, À Propos, Services, Projets, Contact
- Formulaire de contact avec validation
- Design responsive (mobile, tablet, desktop)
- Animations fluides

## Démarrage Local

### Option 1: Python SimpleHTTPServer
```bash
cd frontend
python -m http.server 3000
```

### Option 2: Live Server (VS Code Extension)
- Installer l'extension "Live Server"
- Clic droit sur index.html → "Open with Live Server"

### Option 3: Node.js serve
```bash
npm install -g serve
serve -s frontend -l 3000
```

## Configuration API

L'application est configurée pour communiquer avec le backend sur:
```
http://localhost:5000/api
```

Modifier dans `src/assets/js/api.js` si nécessaire.

## Déploiement

1. Uploader le contenu du dossier `frontend` sur le serveur web
2. Configurer le CORS et les routes du backend
3. Optimiser les images avant déploiement
