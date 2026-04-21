# ⚡ Commandes Rapides OVH - nunoesteves.com

## 🚀 DÉPLOIEMENT INITIAL

```bash
# 1. Se connecter au serveur OVH
ssh root@[IP_SERVEUR]

# 2. Installer les dépendances
apt update && apt upgrade -y
apt install -y docker.io docker-compose git certbot

# 3. Cloner le projet
cd /home
git clone https://github.com/N89e/JPA.git portfolio
cd portfolio

# 4. Configurer .env
nano backend/.env.production.ovh
# Mettre à jour: FRONTEND_URL, ALLOWED_ORIGINS, EMAIL_USER, EMAIL_PASSWORD

# 5. Générer SSL
certbot certonly --standalone -d nunoesteves.com -d www.nunoesteves.com

# 6. Créer répertoire logs
mkdir -p /var/log/portfolio
chmod 755 /var/log/portfolio

# 7. Démarrer Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 8. Vérifier la santé
curl https://nunoesteves.com/api/health
```

---

## 📊 VÉRIFICATION & MONITORING

### Voir l'état des services
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Voir les logs en temps réel
```bash
# Tous les services
docker-compose -f docker-compose.prod.yml logs -f

# Seulement le backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Seulement nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Dernières 100 lignes
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

### Vérifier la santé de l'API
```bash
curl https://nunoesteves.com/api/health | jq .
```

### Vérifier les certificats SSL
```bash
# Lister les certificats
certbot certificates

# Test de renouvellement
certbot renew --dry-run

# Renouveler maintenant
certbot renew --force-renewal
```

### Vérifier l'espace disque
```bash
df -h
du -sh /home/portfolio
```

### Vérifier les ressources Docker
```bash
docker stats
```

---

## 🔄 REDÉMARRAGE & MAINTENANCE

### Redémarrer les services
```bash
# Tout redémarrer
docker-compose -f docker-compose.prod.yml restart

# Redémarrer un service spécifique
docker-compose -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.prod.yml restart nginx
```

### Arrêter les services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Mettre à jour le projet
```bash
cd /home/portfolio
git pull origin main
docker-compose -f docker-compose.prod.yml up --build -d
```

### Nettoyer les images Docker
```bash
docker image prune
docker container prune
docker volume prune
```

---

## 🧪 TESTS & VALIDATION

### Test DNS
```bash
nslookup nunoesteves.com
dig nunoesteves.com
```

### Test HTTPS
```bash
# Vérifier le certificat
openssl s_client -connect nunoesteves.com:443 -servername nunoesteves.com

# Test rapide curl
curl -I https://nunoesteves.com
```

### Test du formulaire
```bash
curl -X POST https://nunoesteves.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "subject": "Demande de collaboration",
    "message": "Message de test"
  }'
```

### Test protection XSS
```bash
curl -X POST https://nunoesteves.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(1)</script>",
    "email": "test@test.com",
    "subject": "Test",
    "message": "Test"
  }'

# Réponse attendue: {"success":false, "message":"Le nom contient..."}
```

### Vérifier les headers de sécurité
```bash
curl -I https://nunoesteves.com | grep -E "X-|Strict|Content-Security"
```

---

## 📝 LOGS & DEBUGGING

### Voir le fichier log backend
```bash
tail -f /var/log/portfolio/backend.log

# Dernières 50 lignes
tail -n 50 /var/log/portfolio/backend.log

# Filtrer les erreurs
grep ERROR /var/log/portfolio/backend.log

# Filtrer par service spécifique
grep "email" /var/log/portfolio/backend.log
```

### Nettoyer les logs
```bash
# Vider le fichier log
truncate -s 0 /var/log/portfolio/backend.log

# Archiver les logs
tar -czf /home/portfolio/logs-backup-$(date +%Y%m%d).tar.gz /var/log/portfolio/
```

### Voir les variables d'environnement
```bash
# Vérifier les variables du container backend
docker-compose -f docker-compose.prod.yml exec backend env | sort
```

---

## 🔐 SÉCURITÉ

### Vérifier le statut du firewall
```bash
ufw status
ufw enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
```

### Vérifier les ports ouverts
```bash
netstat -tlnp | grep LISTEN
ss -tlnp
```

### Audit de sécurité rapide
```bash
# Score SSL
# Accéder à: https://www.ssllabs.com/ssltest/?d=nunoesteves.com

# Headers de sécurité
curl -I https://nunoesteves.com

# WHOIS du domaine
whois nunoesteves.com
```

---

## 🆘 TROUBLESHOOTING RAPIDE

### Le site ne répond pas
```bash
# 1. Vérifier les services
docker-compose -f docker-compose.prod.yml ps

# 2. Vérifier les logs
docker-compose -f docker-compose.prod.yml logs backend

# 3. Redémarrer
docker-compose -f docker-compose.prod.yml restart

# 4. Vérifier les ports
netstat -tlnp | grep -E ':(80|443|5000)'
```

### Certificat SSL expiré
```bash
# Renouveler immédiatement
certbot renew --force-renewal

# Redémarrer nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Erreur de formulaire
```bash
# Vérifier la config email
docker-compose -f docker-compose.prod.yml exec backend env | grep EMAIL

# Tester la connexion SMTP
telnet smtp.gmail.com 587
```

### Performance lente
```bash
# Voir l'utilisation des ressources
docker stats

# Vérifier l'espace disque
df -h
du -sh /home/portfolio

# Vérifier la mémoire disponible
free -h
```

### Erreur de permission
```bash
# Corriger les permissions
chmod -R 755 /home/portfolio
chown -R root:root /home/portfolio

# Corriger les logs
chmod 755 /var/log/portfolio
```

---

## 📅 CRON JOBS UTILES

### Ajouter au crontab
```bash
crontab -e

# Renouveller SSL tous les mois
0 2 1 * * certbot renew --quiet && docker-compose -f /home/portfolio/docker-compose.prod.yml restart nginx

# Sauvegarder les logs quotidiennement
0 3 * * * tar -czf /home/portfolio/logs-$(date +\%Y\%m\%d).tar.gz /var/log/portfolio/

# Nettoyer les vieux logs
0 4 * * 0 find /home/portfolio -name "logs-*.tar.gz" -mtime +30 -delete

# Vérifier la santé tous les 5 min
*/5 * * * * curl -s https://nunoesteves.com/api/health > /dev/null || echo "Portfolio down" | mail -s "Alert" admin@example.com
```

### Voir les cron jobs actifs
```bash
crontab -l
```

---

## 🐳 DOCKER UTILE

### Exécuter une commande dans un container
```bash
docker-compose -f docker-compose.prod.yml exec backend npm list
docker-compose -f docker-compose.prod.yml exec backend ls -la /app
```

### Accéder au shell du container
```bash
docker-compose -f docker-compose.prod.yml exec backend sh
docker-compose -f docker-compose.prod.yml exec nginx sh
```

### Voir les volumes
```bash
docker volume ls
docker volume inspect [volume_name]
```

### Nettoyer l'espace Docker
```bash
# Tout nettoyer (dangereux!)
docker system prune -a

# Plus sûr - juste les images non utilisées
docker image prune
```

---

## 📞 CONTACTS & RESSOURCES

### Documentation officielle
- Docker: https://docs.docker.com/
- Let's Encrypt: https://letsencrypt.org/
- Nginx: https://nginx.org/en/docs/
- OVH: https://docs.ovh.com/

### Outils de diagnostic
- SSL Labs: https://www.ssllabs.com/ssltest/
- DNS Checker: https://dnschecker.org/
- Header Checker: https://securityheaders.com/

### Support
- Email: nunodafonseca@live.fr
- Logs: `/var/log/portfolio/backend.log`
- Health: `https://nunoesteves.com/api/health`

---

## 🎯 AIDE-MÉMOIRE

```bash
# Vérifier tout rapidement
docker-compose -f docker-compose.prod.yml ps && curl https://nunoesteves.com/api/health

# Voir tous les logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f --tail=50

# Mettre à jour et redéployer
git pull && docker-compose -f docker-compose.prod.yml up --build -d

# Renouveler SSL et redémarrer
certbot renew && docker-compose -f docker-compose.prod.yml restart nginx

# Archiver et nettoyer les logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz /var/log/portfolio/ && truncate -s 0 /var/log/portfolio/backend.log
```

---

**Version**: 1.0  
**Dernière mise à jour**: Avril 2026  
**Domaine**: nunoesteves.com
