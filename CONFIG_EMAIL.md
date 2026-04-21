# Guide de Configuration - Système de Contact par Email

## 📋 Configuration Requise

Pour que le système de contact fonctionne complètement, vous devez configurer les paramètres email dans le fichier `.env` du backend.

### 1️⃣ Fichier `.env` (Backend)

Créez ou modifiez le fichier `backend/.env`:

```env
# Configuration Serveur
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Configuration Email - IMPORTANT À REMPLIR
EMAIL_SERVICE=gmail                          # Service email (gmail, outlook, etc.)
EMAIL_USER=your-email@gmail.com              # ✅ À REMPLACER par votre email
EMAIL_PASSWORD=your-app-password             # ✅ À REMPLACER par votre mot de passe d'application
OWNER_EMAIL=nunodafonseca@live.fr           # ✅ Email du propriétaire

# Sécurité
MAX_MESSAGE_LENGTH=5000
MAX_NAME_LENGTH=100
MAX_EMAIL_LENGTH=254
MAX_SUBJECT_LENGTH=200
```

---

## 🔑 Configuration Gmail (Recommandé)

### Étape 1: Activer l'authentification à deux facteurs

1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur **Sécurité** (dans le menu de gauche)
3. Activez **Authentification à deux facteurs**

### Étape 2: Générer un mot de passe d'application

1. Retournez à **Sécurité** 
2. Cherchez **Mots de passe des applications**
3. Sélectionnez:
   - **Appareil:** Windows / Mac / Linux
   - **Application:** Mail
4. Google génèrera un mot de passe de 16 caractères
5. Copiez ce mot de passe (sans les espaces)

### Étape 3: Ajouter au fichier `.env`

```env
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx        # (Sans les espaces)
OWNER_EMAIL=nunodafonseca@live.fr
```

---

## 📧 Configuration Outlook / Hotmail

### Accès Confidentiel d'Application

```env
EMAIL_SERVICE=outlook
EMAIL_USER=votre-email@outlook.com
EMAIL_PASSWORD=votre-mot-de-passe-outlook
OWNER_EMAIL=nunodafonseca@live.fr
```

---

## 🧪 Tester la Configuration

Avant de commencer, testez la configuration email:

### Option 1: Via curl (Terminal)

```bash
# Du répertoire backend
npm install
npm start
```

Le serveur affichera:
```
✅ Configuration email valide
```

### Option 2: Envoyer un email de test

Créez un fichier `test-email.js`:

```javascript
import { sendUserConfirmationEmail, sendContactRequestToOwner } from './src/services/emailService.js';

// Test email confirmation
const testUserEmail = async () => {
  const result = await sendUserConfirmationEmail('test@example.com', 'Test User');
  console.log('Email utilisateur envoyé:', result);
};

// Test email to owner
const testOwnerEmail = async () => {
  const result = await sendContactRequestToOwner({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'Ceci est un message de test'
  });
  console.log('Email propriétaire envoyé:', result);
};

testUserEmail();
testOwnerEmail();
```

Exécutez:
```bash
node test-email.js
```

---

## ✅ Flux Complet du Système de Contact

### 1. **Frontend (Validation client)**
```
Utilisateur remplit le formulaire
       ↓
Validation HTML5 + JavaScript
  - Vérification des champs requis
  - Format email valide
  - Longueur des champs
  - Pas d'injection XSS
       ↓
Affichage d'erreur si invalide
```

### 2. **Backend (Validation serveur)**
```
Reçoit les données du formulaire
       ↓
Middleware validateContactMiddleware
  - Validation complète des champs
  - Sanitization (suppression codes malveillants)
  - Prévention injection SQL
       ↓
Si valide → Contrôleur submitContact
```

### 3. **Envoi des Emails (Parallèle)**
```
Deux emails envoyés simultanément:

📧 Email 1: Confirmation à l'utilisateur
  - Message de confirmation
  - Délai de réponse estimé
  - Design professionnel

📧 Email 2: Notification au propriétaire
  - Toutes les infos du contact
  - Informations complètes du demandeur
  - Bouton répondre direct (reply-to)
```

### 4. **Frontend Feedback**
```
✅ Succès: Affiche "Votre demande a été prise en compte..."
❌ Erreur: Affiche "Erreur lors de l'envoi..."
⏳ En cours: Affiche "Envoi en cours..."
```

---

## 🔒 Sécurité Implémentée

### Frontend
- ✅ Validation HTML5
- ✅ Validation JavaScript complète
- ✅ Prévention XSS (échappement HTML)
- ✅ Limite de caractères
- ✅ Validation format email

### Backend
- ✅ Validation complète des données
- ✅ Sanitization (suppression caractères dangereux)
- ✅ Prévention injection SQL
- ✅ Vérification des longueurs
- ✅ Middleware de validation

### Email
- ✅ Authentification sécurisée
- ✅ Mots de passe d'application (Gmail)
- ✅ Templates HTML professionnels
- ✅ Protection contre les abus

---

## 📝 Variables d'Environnement Complètes

```env
# ==================
# SERVER CONFIG
# ==================
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://votre-domaine.com

# ==================
# EMAIL CONFIG
# ==================
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
OWNER_EMAIL=nunodafonseca@live.fr

# ==================
# SÉCURITÉ
# ==================
MAX_MESSAGE_LENGTH=5000
MAX_NAME_LENGTH=100
MAX_EMAIL_LENGTH=254
MAX_SUBJECT_LENGTH=200
```

---

## 🐛 Dépannage

### "EAUTH: Authentication failed"
- ✅ Vérifiez que l'authentification 2FA est activée sur Gmail
- ✅ Régénérez un nouveau mot de passe d'application
- ✅ Vérifiez qu'il y a pas d'espaces dans le mot de passe du `.env`

### "Cannot find module 'nodemailer'"
```bash
cd backend
npm install
```

### "Email n'est pas reçu"
- ✅ Vérifiez les spams/dossier de promotion
- ✅ Vérifiez l'adresse email du destinataire dans `.env`
- ✅ Consultez les logs du serveur pour les erreurs

### "Le formulaire ne soumet pas"
- ✅ Ouvrez la console du navigateur (F12)
- ✅ Vérifiez les erreurs réseau
- ✅ Vérifiez que le backend est en cours d'exécution

---

## 📦 Dependencies Installés

Vérifiez que nodemailer est installé:

```bash
cd backend
npm list nodemailer
```

Si absent:
```bash
npm install nodemailer
```

---

## 🚀 Prochaines Étapes

1. ✅ Configurez les variables d'environnement `.env`
2. ✅ Testez la configuration email
3. ✅ Démarrez le backend: `npm start`
4. ✅ Testez le formulaire de contact sur le frontend
5. ✅ Vérifiez la réception des emails

---

## 📞 Support

En cas de problème:
1. Consultez les logs du terminal serveur
2. Vérifiez la console du navigateur (Dev Tools)
3. Testez la connexion email avec `test-email.js`
4. Vérifiez que vous n'êtes pas bloqué par un firewall

---

**Créé:** 2026-04-14
**Dernière mise à jour:** 2026-04-14
