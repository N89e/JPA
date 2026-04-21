# 🚀 Déploiement OVH MUTUALISÉ - nunoesteves.com

## 📋 Configuration

```
Hébergement: OVH Mutualisé (cluster121)
Accès: FTP/SFTP uniquement
API: Service externe (Vercel, Render, ou autre)
Budget: ~€5/mois hébergement + ~$5 API gratuite/mois
```

---

## ⚠️ Limitations du Mutualisé

```
❌ Pas de Docker
❌ Pas de Node.js backend
❌ Pas de SSH root
❌ PHP uniquement (généralement)
✅ Frontend statique possible
✅ FTP/SFTP
✅ Bon marché
```

---

## 🎯 Stratégie: Frontend + Backend Externe

```
┌──────────────────────────────────────┐
│ Frontend (Mutualisé OVH - FTP)       │
│ https://nunoesteves.com              │
│ (HTML, CSS, JS statique)             │
└────────────┬─────────────────────────┘
             │ API calls
             ▼
┌──────────────────────────────────────┐
│ Backend (Service Externe - Gratuit)  │
│ https://api.render.com/...           │
│ (Node.js + Formulaire de contact)    │
└──────────────────────────────────────┘
```

---

## 📝 ÉTAPE 1: Préparer le Frontend

### 1.1 Build le projet frontend

```bash
# Sur ton PC local:
cd frontend
npm install
npm run build

# Crée: frontend/dist/
# Contient: index.html, style.css, app.js, assets/
```

### 1.2 Structure des fichiers à uploader

```
dist/
├── index.html          (page principale)
├── style.css           (styles)
├── app.js              (JavaScript)
└── assets/
    ├── css/
    ├── js/
    └── images/
```

### 1.3 Préparer l'accès FTP

**Récupère tes infos OVH:**

1. Va sur https://www.ovhmanager.com/
2. **Web Cloud** → **Hébergements**
3. Sélectionne ton hébergement
4. **FTP/SFTP** → Cherche:
   - ✅ **Utilisateur FTP**: (exemple: `ovh1234567`)
   - ✅ **Mot de passe FTP**: (récupère dans "Modifier mot de passe")
   - ✅ **Serveur FTP**: `ftp.cluster121.hosting.ovh.net`
   - ✅ **Répertoire racine**: `/www` ou `/` (généralement `/`)

---

## 🐳 ÉTAPE 2: Déployer le Backend (Render.com - Gratuit)

### 2.1 Créer un compte Render

1. Va sur https://render.com/
2. Clique **"Sign Up"**
3. Connecte-toi avec GitHub
4. **Autorise l'accès** au repo `N89e/JPA`

### 2.2 Créer un Web Service

1. Dashboard Render → **New +** → **Web Service**
2. Sélectionne le repo: **N89e/JPA**
3. Configure:
   - **Name**: `portfolio-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### 2.3 Ajouter les Variables d'Environnement

Dans Render (onglet **Environment**):

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://nunoesteves.com
ALLOWED_ORIGINS=https://nunoesteves.com,https://www.nunoesteves.com
EMAIL_SERVICE=gmail
EMAIL_USER=nuno.esteves89@gmail.com
EMAIL_PASSWORD=kzilzvcxacfpkbik
OWNER_EMAIL=nunodafonseca@live.fr
LOG_LEVEL=info
RATE_LIMIT_MAX_REQUESTS=5
MAX_MESSAGE_LENGTH=5000
MAX_NAME_LENGTH=100
MAX_EMAIL_LENGTH=254
MAX_SUBJECT_LENGTH=200
```

### 2.4 Récupérer l'URL de l'API

Une fois déployé, Render te donne une URL du type:
```
https://portfolio-api-xxx.onrender.com
```

**Note cette URL!** ⬅️ Elle sera utilisée par le frontend

### 2.5 Tester l'API

```bash
curl https://portfolio-api-xxx.onrender.com/api/health

# Réponse attendue:
# {"status":"healthy","timestamp":"..."}
```

---

## 🌐 ÉTAPE 3: Configurer le Frontend pour l'API Externe

### 3.1 Mettre à jour les endpoints API

Édite: `frontend/src/assets/js/api/config.js`

```javascript
// AVANT (localhost):
const API_BASE_URL = 'http://localhost:5000';

// APRÈS (Render):
const API_BASE_URL = 'https://portfolio-api-xxx.onrender.com';
```

**Remplace `xxx` par le vrai ID Render!**

### 3.2 Vérifier le client API

Fichier: `frontend/src/assets/js/api/client.js`

Doit contenir:
```javascript
export async function submitContact(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Important pour CORS
    });
    return response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}
```

### 3.3 Rebuild le frontend

```bash
cd frontend
npm run build
# Crée: dist/ avec les nouvelles URLs API
```

---

## 📤 ÉTAPE 4: Upload via FTP

### 4.1 Utiliser WinSCP (Graphique - le plus simple)

**Sur Windows:**

1. Télécharge WinSCP: https://winscp.net/
2. Ouvre WinSCP → **New Session**
3. Configure:
   - **Host**: `ftp.cluster121.hosting.ovh.net`
   - **Username**: (ton login FTP OVH)
   - **Password**: (ton mot de passe FTP)
   - **Port**: `22` (SFTP) ou `21` (FTP)
   - **Protocol**: SFTP

4. Clique **Login**
5. **Drag & drop** `frontend/dist/*` vers la racine du serveur

### 4.2 Utiliser FileZilla (Alternative)

1. Télécharge FileZilla: https://filezilla-project.org/
2. **File** → **Site Manager**
3. Configure:
   - **Host**: `ftp.cluster121.hosting.ovh.net`
   - **Username**: (login FTP)
   - **Password**: (mot de passe)
   - **Port**: `21` (ou `22` pour SFTP)

4. **Connect**
5. Upload les fichiers de `dist/`

### 4.3 Utiliser ligne de commande (Terminal)

```bash
# Test de connexion SFTP
sftp -P 22 username@ftp.cluster121.hosting.ovh.net

# Une fois connecté:
cd /www                          # Aller au dossier web
put -r dist/* .                  # Upload tous les fichiers
ls -la                           # Vérifier l'upload
exit                             # Déconnecter
```

---

## ✅ ÉTAPE 5: Tester le Déploiement

### 5.1 Accéder au site

```
https://nunoesteves.com/
```

**Vérifie:**
- ✅ Page s'affiche
- ✅ Menu fonctionne
- ✅ CSS chargé
- ✅ Images visibles

### 5.2 Tester le formulaire

1. Remplis le formulaire de contact
2. Envoie
3. Vérifie:
   - ✅ Message de succès affiché
   - ✅ Email reçu

### 5.3 Vérifier la console (F12)

```javascript
// Ouvre F12 → Console
// Envoie un test manuel:
fetch('https://portfolio-api-xxx.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🔒 ÉTAPE 6: Configurer le Domaine DNS

### 6.1 Accéder aux DNS OVH Manager

1. https://www.ovhmanager.com/
2. **Domaines** → **nunoesteves.com**
3. **Zone DNS**

### 6.2 Configurer les enregistrements

**Cherche l'adresse IP de l'hébergement mutualisé:**

Dans OVH Manager:
- **Web Cloud** → **Hébergements** → **nunoesteves.com**
- **Informations générales** → **Adresse IPv4**
- Note: `xxx.xxx.xxx.xxx`

### 6.3 Ajouter les enregistrements DNS

| Type | Sous-domaine | Cible | TTL |
|------|--------------|-------|-----|
| A | @ | `xxx.xxx.xxx.xxx` | 3600 |
| A | www | `xxx.xxx.xxx.xxx` | 3600 |

**Ajoute aussi (si email OVH):**

| Type | Sous-domaine | Cible | TTL |
|------|--------------|-------|-----|
| MX | @ | 10 mail.ovh.net | 3600 |

### 6.4 Vérifier la propagation

```bash
# Attendre 15-30 min, puis:
nslookup nunoesteves.com

# Doit afficher l'IP de l'hébergement mutualisé
```

---

## 🔐 ÉTAPE 7: HTTPS - Certificat SSL

### 7.1 Sur OVH Manager

1. **Web Cloud** → **Hébergements** → **nunoesteves.com**
2. **SSL/TLS** → **Acheter un certificat SSL**
3. OVH offre **Let's Encrypt gratuit** ✅
4. Sélectionne **Let's Encrypt** (GRATUIT)
5. Valide le domaine

### 7.2 Attendre l'installation

- Généralement 15-30 min
- OVH va envoyer un email de confirmation

### 7.3 Vérifier HTTPS

```bash
curl -I https://nunoesteves.com

# Doit répondre: 200 OK
# Header: Strict-Transport-Security
```

---

## 🚀 RÉSUMÉ DU DÉPLOIEMENT

```bash
# 1. Build le frontend local
cd frontend && npm run build

# 2. Upload via FTP/SFTP
# Utilise WinSCP ou FileZilla
# Destination: racine du serveur mutualisé

# 3. Déploie le backend sur Render
# Render se connecte à GitHub
# Auto-déploiement à chaque push

# 4. Configure le DNS OVH
# Points vers l'IP de l'hébergement mutualisé

# 5. Active SSL/HTTPS
# Utilise Let's Encrypt gratuit d'OVH

# Résultat: https://nunoesteves.com ✅
```

---

## 📊 Coûts Finaux

```
Hébergement mutualisé OVH:     ~€5-10/mois
Domaine nunoesteves.com:        ~€10-15/an
Backend Render (gratuit tier):  €0/mois
Certificat SSL (Let's Encrypt): €0/mois
─────────────────────────────────────────
TOTAL:                          ~€15-25/mois (hébergement)
```

**C'est le déploiement le MOINS CHER!** 💰

---

## ⚠️ Limitations Connues

```
❌ Render tue les instances inactives > 15 min (sleep)
✅ Se reveille automatiquement à la première requête
✅ Gratuit à 100% pour usage modéré

❌ Pas de base de données persistante gratuite
✅ Peut être ajoutée pour ~$7/mois

❌ Si beaucoup de trafic: Render payant (+$7/mois)
✅ Pour un portfolio: gratuit suffisant
```

---

## 🔄 Mise à Jour Futur

### Ajouter des articles/projets

1. Édite `frontend/src/pages/myProjects/myProjects.html`
2. `npm run build`
3. Upload le `dist/` mis à jour via FTP
4. C'est tout! 🎉

### Ajouter une vraie base de données

1. Crée une DB PostgreSQL sur Render (~$7/mois)
2. Ajoute la connexion à `backend/.env`
3. Render redéploie automatiquement
4. Puis test!

---

## 📞 Support & Aide

- **Accès FTP**: OVH Manager → Web Cloud → Hébergements
- **Backend Render**: https://render.com/docs
- **DNS OVH**: https://www.ovhmanager.com/
- **Let's Encrypt**: https://letsencrypt.org/

---

## ✅ Checklist Final

- [ ] Frontend buildé localement: `npm run build`
- [ ] Backend déployé sur Render: `https://portfolio-api-xxx.onrender.com`
- [ ] Frontend uploadé via FTP: `nunoesteves.com`
- [ ] DNS configuré vers hébergement mutualisé
- [ ] SSL/HTTPS activé (Let's Encrypt OVH)
- [ ] Formulaire de contact fonctionne
- [ ] Email reçu

---

## 🎉 C'est Prêt!

Ton portfolio est maintenant sur:
```
https://nunoesteves.com
```

Avec:
✅ Frontend statique rapide (OVH mutualisé)
✅ Backend Node.js gratuit (Render)
✅ Formulaire de contact fonctionnel
✅ Emails automatiques
✅ HTTPS sécurisé
✅ Validation XSS active
✅ Coût minimal (~€15-25/mois)

---

**Besoin d'aide pour une étape? Dis-moi laquelle!** 🚀
