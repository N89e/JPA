# 🚀 Production Deployment Guide

Guide complet pour lancer votre portfolio en mode production (localhost ou OVH).

---

## 📋 Table des matières

1. [Lancer en Production Locale (localhost)](#-lancer-en-production-locale)
2. [Lancer en Production OVH](#-lancer-en-production-ovh)
3. [Vérifier le Déploiement](#-vérifier-le-déploiement)
4. [Troubleshooting](#-troubleshooting)
5. [Arrêter les Services](#-arrêter-les-services)

---

## 🏠 Lancer en Production Locale

### Étape 1: Vérifier les variables d'environnement

```bash
# Vérifier que le fichier existe
cat backend/.env.production.local
```

### Étape 2: Lancer avec Docker Compose

**Option A: Avec le script PowerShell (Recommended)**

```powershell
# Windows PowerShell
.\deploy-prod.ps1 -Environment local
```

**Option B: Commande Docker Compose directe**

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

**Option C: Mode développement production (pour debug)**

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Étape 3: Vérifier que tout fonctionne

```bash
# Health Check
curl http://localhost:5000/api/health

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Accéder au frontend
open http://localhost:3000
```

### Résultat attendu

```json
{
  "status": "healthy",
  "environment": "production",
  "services": {"api": "up"},
  "requestId": "uuid-here"
}
```

---

## ☁️ Lancer en Production OVH

### Prérequis

- ✅ Compte OVH Cloud
- ✅ Domaine configuré
- ✅ Identifiants Gmail app-specific
- ✅ Certificat SSL (OVH)

### Étape 1: Configurer les variables OVH

**Éditer le fichier de configuration:**

```bash
# Éditer backend/.env.production.ovh
# Remplacer les valeurs placeholders:
# - your-domain.com → votre domaine réel
# - your-email@gmail.com → votre email
# - your-app-specific-password → mot de passe app Gmail
```

**Valeurs à configurer:**

```env
FRONTEND_URL=https://mon-portfolio.com
ALLOWED_ORIGINS=https://mon-portfolio.com,https://www.mon-portfolio.com
EMAIL_USER=mon-email@gmail.com
EMAIL_PASSWORD=mon-app-password
EMAIL_LOGO_URL=https://mon-portfolio.com/images/Logo_Portfolio.png
EMAIL_SIGNATURE_URL=https://mon-portfolio.com/images/Nuno_ESTEVES-SIGNATURE.png
```

### Étape 2: Préparer l'environnement OVH

```bash
# Créer les répertoires de logs
mkdir -p /var/log/portfolio
chmod 755 /var/log/portfolio

# Vérifier que Docker est installé
docker --version
docker-compose --version

# (Optionnel) Se connecter à votre registre Docker privé si nécessaire
docker login
```

### Étape 3: Déployer sur OVH

**Option A: Avec le script PowerShell**

```powershell
.\deploy-prod.ps1 -Environment ovh
```

**Option B: Commande directe**

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Étape 4: Vérifier le déploiement

```bash
# Health Check
curl https://mon-portfolio.com/api/health

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Vérifier les conteneurs
docker ps
```

### Étape 5: Configurer le SSL avec OVH

Si vous n'avez pas déjà SSL:

```bash
# Utiliser Let's Encrypt via Certbot
certbot certonly --standalone -d mon-portfolio.com -d www.mon-portfolio.com

# Ou utiliser le certificat OVH fourni
# (Suivez les instructions du dashboard OVH)
```

---

## ✅ Vérifier le Déploiement

### 1. Vérifier la santé du backend

```bash
# Health endpoint
curl http://localhost:5000/api/health

# Réponse attendue:
{
  "status": "healthy",
  "timestamp": "2026-04-16T...",
  "uptime": 123.456,
  "environment": "production",
  "services": {"api": "up"},
  "requestId": "uuid..."
}
```

### 2. Tester le formulaire de contact

```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'

# Réponse attendue:
{
  "success": true,
  "message": "Votre demande a été prise en compte...",
  "data": {...}
}
```

### 3. Vérifier le rate limiting

```bash
# Envoyer 6 requêtes rapidement (limite: 5 par 15 minutes)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/contact/submit \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'
done

# La 6ème devrait retourner 429 (Too Many Requests)
```

### 4. Vérifier les logs en production

```bash
# Logs JSON formatés
docker-compose -f docker-compose.prod.yml logs backend

# Logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Filtrer par niveau
docker-compose -f docker-compose.prod.yml logs backend | grep '"level":"ERROR"'
```

### 5. Vérifier les ressources

```bash
# État des conteneurs
docker ps

# Utilisation CPU/Mémoire
docker stats

# Logs détaillés
docker inspect portfolio-backend-1
```

---

## 🔧 Troubleshooting

### ❌ Erreur: Port 5000 déjà utilisé

```bash
# Trouver le processus qui utilise le port
netstat -ano | findstr :5000

# Arrêter le processus
taskkill /PID <PID> /F

# Ou changer le port dans docker-compose.prod.yml
```

### ❌ Backend unhealthy

```bash
# Voir les logs d'erreur
docker logs portfolio-backend-1

# Redémarrer le conteneur
docker-compose -f docker-compose.prod.yml restart backend

# Vérifier la santé manuellement
curl http://localhost:5000/api/health
```

### ❌ Emails ne s'envoient pas

```bash
# Vérifier les identifiants Gmail
# - EMAIL_USER et EMAIL_PASSWORD dans .env

# S'assurer que "Less secure app access" est activé
# ou utiliser une app-specific password

# Voir les erreurs dans les logs
docker logs portfolio-backend-1 | grep -i email
```

### ❌ CORS errors

```bash
# Vérifier les origines autorisées
cat backend/.env.production.local | grep ALLOWED_ORIGINS

# Ajouter votre domaine si manquant
# ALLOWED_ORIGINS=http://localhost:3000,https://mon-domaine.com
```

### ❌ Certificat SSL invalide (OVH)

```bash
# Renouveler le certificat
certbot renew

# Ou charger le certificat OVH dans nginx.conf.prod
# Redémarrer les conteneurs
docker-compose -f docker-compose.prod.yml restart
```

---

## 🛑 Arrêter les Services

### Arrêter tous les conteneurs

```bash
docker-compose -f docker-compose.prod.yml down
```

### Arrêter et supprimer les volumes

```bash
docker-compose -f docker-compose.prod.yml down -v
```

### Redémarrer les services

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Voir les logs avant suppression

```bash
docker-compose -f docker-compose.prod.yml logs > backup-logs.txt
docker-compose -f docker-compose.prod.yml down
```

---

## 📊 Monitoring en Production

### Vérifier les logs en temps réel

```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Vérifier les erreurs

```bash
# Erreurs de contact
docker logs portfolio-backend-1 | grep -i "contact\|email\|error"

# Erreurs de rate limiting
docker logs portfolio-backend-1 | grep -i "rate limit\|429"

# Erreurs CORS
docker logs portfolio-backend-1 | grep -i "cors"
```

### Voir les métriques

```bash
# CPU et mémoire
docker stats portfolio-backend-1

# Détails du conteneur
docker inspect portfolio-backend-1
```

---

## 🔐 Sécurité en Production

### ✅ Bonnes pratiques

1. **Secrets sécurisés**: Ne jamais commiter `.env.production.ovh`
   ```bash
   echo "backend/.env.production.ovh" >> .gitignore
   ```

2. **HTTPS obligatoire**: Configurer SSL/TLS
   ```bash
   # OVH fournit les certificats
   # nginx.conf.prod utilise HSTS
   ```

3. **Rate limiting**: Activé par défaut
   - Contact form: 5 req/15min
   - API: 30 req/sec

4. **Validation input**: Tous les formulaires validés
   - Sanitization avec `isomorphic-dompurify`
   - Limites de taille configurées

5. **Logs structurés**: Tous les événements loggés
   ```bash
   # Format JSON pour parsing
   {"timestamp":"...","level":"INFO","message":"..."}
   ```

---

## 📝 Checkliste Production

- [ ] Domaine OVH configuré
- [ ] Certificat SSL installé
- [ ] Variables `.env.production.ovh` configurées
- [ ] Identifiants Gmail app-specific générés
- [ ] Emails OWNER_EMAIL vérifiés
- [ ] Rate limiting testé
- [ ] Health check validé
- [ ] Logs en JSON formatés
- [ ] Backups configurés
- [ ] Monitoring en place
- [ ] `.gitignore` contient `.env.production.*`

---

## 🆘 Support & Logs

Pour déboguer, consultez:

1. **Backend logs**: `docker logs portfolio-backend-1`
2. **Frontend logs**: `docker logs portfolio-frontend-1`
3. **Fichier env**: `cat backend/.env.production.local`
4. **Docker stats**: `docker stats`

---

**Vous êtes prêt à déployer en production! 🚀**
