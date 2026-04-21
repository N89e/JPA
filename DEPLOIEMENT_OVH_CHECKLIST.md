# ✅ Checklist Déploiement OVH - nunoesteves.com

## 📌 AVANT LE DÉPLOIEMENT

### Préparation Locale
- [ ] Code pushed sur GitHub (branche main)
- [ ] `.env.production.ovh` configuré avec domaine `nunoesteves.com`
- [ ] Email Gmail configuré dans `.env.production.ovh`
- [ ] Certificats SSL placés (ou Let's Encrypt configuré)
- [ ] Tous les fichiers committés et pushés

### Accès OVH
- [ ] Accès SSH au serveur OVH fonctionnant
- [ ] IP du serveur connue
- [ ] Pas de restrictions firewall

---

## 🔗 ÉTAPE 1: Configuration DNS (15 min)

### Sur OVH Manager
- [ ] Connecté à https://www.ovhmanager.com/
- [ ] Trouvé le domaine `nunoesteves.com` dans **Domaines**
- [ ] Ouvert l'onglet **Zone DNS**

### Enregistrements DNS ajoutés
- [ ] Enregistrement **A** pour `@` pointant vers IP serveur OVH
- [ ] Enregistrement **A** pour `www` pointant vers IP serveur OVH
- [ ] Enregistrement **MX** configuré (si email hébergé)
- [ ] DNS propagé (attendre 15-30 min)
- [ ] Vérification DNS: `nslookup nunoesteves.com` fonctionne

---

## 🖥️ ÉTAPE 2: Préparation Serveur OVH (20 min)

### Connexion SSH
- [ ] SSH connecté: `ssh root@[IP_SERVEUR]`
- [ ] Mises à jour du système: `apt update && apt upgrade -y`

### Installation dépendances
- [ ] Docker installé: `apt install -y docker.io docker-compose`
- [ ] Docker démarré: `systemctl start docker`
- [ ] Git installé: `apt install -y git`
- [ ] Node.js 18+ installé (optionnel)

### Clonage projet
- [ ] Projet cloné: `git clone https://github.com/N89e/JPA.git portfolio`
- [ ] Dossier créé: `/home/portfolio`

---

## ⚙️ ÉTAPE 3: Configuration Projet (15 min)

### Fichier .env.production.ovh
- [ ] Créé depuis `.env.example`
- [ ] `FRONTEND_URL=https://nunoesteves.com` configuré
- [ ] `ALLOWED_ORIGINS` configuré
- [ ] Email Gmail configuré (`EMAIL_USER`, `EMAIL_PASSWORD`)
- [ ] `OWNER_EMAIL=nunodafonseca@live.fr` configuré
- [ ] `LOG_LEVEL=info` configuré
- [ ] `NODE_ENV=production` configuré

### Fichier nginx.conf.prod
- [ ] `server_name nunoesteves.com www.nunoesteves.com;` ajouté
- [ ] Redirection HTTP→HTTPS configurée
- [ ] Chemins des certificats SSL corrects

---

## 🔒 ÉTAPE 4: SSL/HTTPS Let's Encrypt (10 min)

### Générer certificats
- [ ] Certbot installé: `apt install -y certbot`
- [ ] Certificats générés: 
  ```bash
  certbot certonly --standalone -d nunoesteves.com -d www.nunoesteves.com
  ```
- [ ] Certificats présents:
  ```bash
  ls /etc/letsencrypt/live/nunoesteves.com/
  ```
  (fullchain.pem et privkey.pem existants)

### Renouvellement auto
- [ ] Auto-renouvellement testé: `certbot renew --dry-run`
- [ ] Cron job ajouté pour renouvellement automatique

---

## 🐳 ÉTAPE 5: Démarrage Docker Compose (15 min)

### Préparation
- [ ] Répertoire logs créé: `mkdir -p /var/log/portfolio`
- [ ] Permissions correctes: `chmod 755 /var/log/portfolio`
- [ ] CD vers le projet: `cd /home/portfolio`

### Démarrage services
- [ ] Services démarrés:
  ```bash
  docker-compose -f docker-compose.prod.yml up -d
  ```
- [ ] Services actifs: `docker-compose -f docker-compose.prod.yml ps`
  - [ ] `backend` en état `Up`
  - [ ] `nginx` en état `Up`
  - [ ] `frontend` en état `Up`

### Vérification logs
- [ ] Pas d'erreurs dans les logs:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f backend
  ```

---

## ✅ ÉTAPE 6: Tests & Vérifications (10 min)

### Test DNS
- [ ] DNS résolu: `nslookup nunoesteves.com` (affiche IP correcte)

### Test HTTPS
- [ ] Site accessible: `curl -I https://nunoesteves.com` (code 200)
- [ ] HTTPS force: `curl -I http://nunoesteves.com` (redirect 301→443)

### Test certificat SSL
- [ ] Certificat valide: 
  ```bash
  openssl s_client -connect nunoesteves.com:443 -servername nunoesteves.com
  ```
  (Verify return code: 0 ok)

### Test API
- [ ] Health check: 
  ```bash
  curl https://nunoesteves.com/api/health
  ```
  Réponse: `{"status":"healthy"}`

### Test formulaire
- [ ] Formulaire accepte données valides:
  ```bash
  curl -X POST https://nunoesteves.com/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Message"}'
  ```
  Réponse: `{"success":true}`

### Test XSS Protection
- [ ] Formulaire rejette XSS:
  ```bash
  curl -X POST https://nunoesteves.com/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"<script>alert(1)</script>","email":"test@test.com","subject":"Test","message":"Message"}'
  ```
  Réponse: `{"success":false, "message":"..."}`

### Test sécurité headers
- [ ] Headers présents: `curl -I https://nunoesteves.com` contient:
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Content-Security-Policy:`
  - [ ] `Strict-Transport-Security:`

---

## 📊 ÉTAPE 7: Monitoring & Logs (5 min)

### Logs actifs
- [ ] Monitoring logs temps réel:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f
  ```

### Fichier log backend
- [ ] Logs écrits dans `/var/log/portfolio/backend.log`
- [ ] Format JSON pour parsing

### Health endpoint
- [ ] Endpoint santé accessible:
  ```bash
  curl https://nunoesteves.com/api/health
  ```

---

## 🎉 POST-DÉPLOIEMENT

### Vérifications finales
- [ ] Site accessible: `https://nunoesteves.com` ✅
- [ ] Formulaire fonctionne et envoie emails ✅
- [ ] SSL grade A+ sur https://www.ssllabs.com/ssltest/ ✅
- [ ] Pas d'erreurs dans les logs ✅
- [ ] Protection XSS active ✅

### Communications
- [ ] Email de test reçu ✅
- [ ] Portfolio visible publiquement ✅
- [ ] Mise à jour portfolio sur LinkedIn ✅
- [ ] Mise à jour du CV avec nouveau site ✅

### Sauvegarde & Documentation
- [ ] Sauvegarde de la config OVH effectuée
- [ ] Credentials stockées en sécurité
- [ ] Documentation de déploiement mise à jour
- [ ] Procédure de rollback documentée

---

## 🆘 DÉPANNAGE RAPIDE

Si quelque chose ne fonctionne pas:

| Problème | Solution |
|----------|----------|
| DNS ne résout pas | Attendre 30 min, `systemctl restart systemd-resolved` |
| HTTPS non accessible | Vérifier ports 80/443: `netstat -tlnp` |
| Certificat invalide | `certbot renew --force-renewal` |
| API non accessible | `docker-compose logs backend` |
| Formulaire pas d'email | Vérifier config Gmail dans `.env.production.ovh` |
| Performance lente | Vérifier ressources: `docker stats` |
| Logs énormes | Nettoyer: `truncate -s 0 /var/log/portfolio/backend.log` |

---

## 📅 MAINTENANCE CONTINUE

### Chaque semaine
- [ ] Vérifier les logs
- [ ] Tester le formulaire
- [ ] Vérifier le certificat SSL (`certbot certificates`)

### Chaque mois
- [ ] Mettre à jour le système: `apt update && apt upgrade`
- [ ] Nettoyer les images Docker: `docker image prune`
- [ ] Vérifier l'espace disque: `df -h`

### Chaque trimestre
- [ ] Sauvegarde complète du serveur
- [ ] Audit de sécurité
- [ ] Test de restauration

---

## 🎯 CHECKLIST FINALE

```
✅ Site accessible sur https://nunoesteves.com
✅ HTTPS fonctionne (certificat SSL valide)
✅ Formulaire de contact fonctionne
✅ Emails de confirmation envoyés
✅ Protection XSS active
✅ Headers de sécurité présents
✅ Logs structurés et accessibles
✅ Auto-renouvellement SSL configuré
✅ Backups en place
✅ Monitoring actif
```

---

**Statut**: ✅ PRÊT POUR PRODUCTION

Date déploiement: ___________  
Déployé par: ___________  
Contact support: nunodafonseca@live.fr
