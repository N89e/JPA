# 🚀 Guide Complet: Déploiement OVH avec nunoesteves.com

## 📋 Prérequis
- ✅ Domaine `nunoesteves.com` (déjà acheté chez OVH)
- ✅ Hébergement OVH (serveur Linux avec Docker)
- ✅ Accès SSH au serveur OVH
- ✅ Docker & Docker Compose installés sur le serveur
- ✅ Node.js 18+ installé

---

## 🔗 ÉTAPE 1: Configuration DNS OVH

### 1.1 Accéder à la gestion DNS

1. Connecte-toi à [OVH Manager](https://www.ovhmanager.com/)
2. Vais dans **Domaines** → **nunoesteves.com**
3. Clique sur l'onglet **Zone DNS**

### 1.2 Configurer les enregistrements DNS

#### Pour un serveur OVH direct:

```
Type    | Sous-domaine | Cible            | TTL
--------|--------------|------------------|-----
A       | @            | 188.165.53.185   | 3600
A       | www          | 188.165.53.185   | 3600
MX      | @            | 10 mail.ovh.net  | 3600
```

**✅ IP du serveur OVH**: `188.165.53.185`

#### Pour Cloudflare (recommandé):

Si tu veux utiliser Cloudflare pour la sécurité:

```
Type    | Nom          | Contenu          | TTL
--------|--------------|------------------|-----
A       | @            | 188.165.53.185   | Auto
CNAME   | www          | nunoesteves.com  | Auto
```

### 1.3 Vérifier la propagation DNS

```bash
# Depuis ton PC
nslookup nunoesteves.com
# Ou
dig nunoesteves.com
```

Attends 15-30 minutes pour la propagation globale.

---

## 🖥️ ÉTAPE 2: Configuration du Serveur OVH

### 2.1 Se connecter au serveur

```bash
ssh root@188.165.53.185
# ou (si DNS est configuré)
ssh root@nunoesteves.com
```

**IP du serveur OVH**: `188.165.53.185`

### 2.2 Installer les dépendances

```bash
# Mettre à jour
apt update && apt upgrade -y

# Installer Docker
apt install -y docker.io docker-compose git

# Démarrer Docker
systemctl start docker
systemctl enable docker

# Installer Node.js (optionnel, si besoin)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
```

### 2.3 Cloner le projet

```bash
cd /home
git clone https://github.com/N89e/JPA.git portfolio
cd portfolio
```

---

## ⚙️ ÉTAPE 3: Configuration du Projet

### 3.1 Créer les fichiers de configuration

```bash
cd /home/portfolio

# Copier le fichier .env pour OVH
cp backend/.env.example backend/.env.production.ovh
```

### 3.2 Éditer la configuration OVH

```bash
nano backend/.env.production.ovh
```

**Remplace les valeurs par:**

```env
# ============ SERVER CONFIGURATION ============
PORT=5000
NODE_ENV=production

# ============ DOMAIN CONFIGURATION ============
FRONTEND_URL=https://nunoesteves.com

# ============ CORS CONFIGURATION ============
ALLOWED_ORIGINS=https://nunoesteves.com,https://www.nunoesteves.com

# ============ EMAIL CONFIGURATION ============
EMAIL_SERVICE=gmail
EMAIL_USER=nuno.esteves89@gmail.com
EMAIL_PASSWORD=kzilzvcxacfpkbik
OWNER_EMAIL=nunodafonseca@live.fr

# ============ EMAIL IMAGE URLS ============
EMAIL_LOGO_URL=https://nunoesteves.com/images/Logo_Portfolio.png
EMAIL_SIGNATURE_URL=https://nunoesteves.com/images/Nuno_ESTEVES-SIGNATURE.png
IMAGES_PATH=/app/frontend/src/assets/images

# ============ LOGGING ============
LOG_LEVEL=info
LOG_FORMAT=json
LOG_TO_FILE=true
LOG_FILE_PATH=/var/log/portfolio/backend.log

# ============ RATE LIMITING ============
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
MAX_REQUEST_SIZE=10mb

# ============ SECURITY ============
MAX_MESSAGE_LENGTH=5000
MAX_NAME_LENGTH=100
MAX_EMAIL_LENGTH=254
MAX_SUBJECT_LENGTH=200
```

**Sauvegarde**: Ctrl+O → Enter → Ctrl+X

### 3.3 Configurer Nginx pour le domaine

```bash
nano nginx.conf.prod
```

**Ajoute au début du fichier:**

```nginx
# Directive pour accepter le domaine nunoesteves.com
server_name nunoesteves.com www.nunoesteves.com;
```

Cherche la ligne avec `server_name _;` et remplace-la par:

```nginx
server_name nunoesteves.com www.nunoesteves.com;
```

---

## 🔒 ÉTAPE 4: Configuration SSL/HTTPS

### 4.1 Installer Certbot pour Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx

# Générer le certificat SSL
certbot certonly --standalone -d nunoesteves.com -d www.nunoesteves.com
```

Les certificats sont générés dans: `/etc/letsencrypt/live/nunoesteves.com/`

### 4.2 Mettre à jour Nginx pour HTTPS

Édite `nginx.conf.prod`:

```bash
nano nginx.conf.prod
```

**Remplace la section server par:**

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name nunoesteves.com www.nunoesteves.com;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name nunoesteves.com www.nunoesteves.com;

    # SSL Certificates from Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/nunoesteves.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nunoesteves.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # ... reste de la configuration
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🐳 ÉTAPE 5: Lancer Docker Compose en Production

### 5.1 Créer les répertoires de logs

```bash
mkdir -p /var/log/portfolio
chmod 755 /var/log/portfolio
```

### 5.2 Démarrer les services

```bash
cd /home/portfolio

# Lancer en mode production
docker-compose -f docker-compose.prod.yml up -d
```

### 5.3 Vérifier le statut

```bash
# Voir les services
docker-compose -f docker-compose.prod.yml ps

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Test de santé
curl http://localhost:5000/api/health
```

---

## ✅ ÉTAPE 6: Vérifications Finales

### 6.1 Tester le site

```bash
# Depuis n'importe quel PC:
curl https://nunoesteves.com/
curl https://nunoesteves.com/api/health
```

### 6.2 Tester le formulaire de contact

```bash
curl -X POST https://nunoesteves.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message content here"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Votre demande a été prise en compte..."
}
```

### 6.3 Vérifier les certificats SSL

```bash
# Vérifie la validité du certificat
openssl s_client -connect nunoesteves.com:443 -servername nunoesteves.com

# Ou via curl
curl -I https://nunoesteves.com
```

### 6.4 Tester l'e-mail

L'e-mail de confirmation doit s'envoyer à `nunodafonseca@live.fr`

---

## 🔄 ÉTAPE 7: Configuration Auto-Renouvellement SSL

```bash
# Test du renouvellement
certbot renew --dry-run

# Ajouter au cron pour auto-renouvellement
crontab -e

# Ajouter cette ligne:
0 2 * * * certbot renew --quiet && docker-compose -f /home/portfolio/docker-compose.prod.yml restart nginx
```

---

## 📊 Vérifications de Sécurité

### SSL/TLS
```bash
# Tester la sécurité SSL
curl -I https://nunoesteves.com
# Cherche: Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options
```

### Headers de Sécurité
```bash
curl -I https://nunoesteves.com | grep -E "X-Frame-Options|X-Content-Type-Options|Content-Security-Policy"
```

---

## 🆘 Troubleshooting

### Le site n'est pas accessible

```bash
# Vérifier les ports
netstat -tlnp | grep -E ':(80|443|5000)'

# Vérifier le firewall
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

### DNS ne se propage pas

```bash
# Forcer la mise à jour
systemctl restart systemd-resolved
# ou
resolvectl flush-caches
```

### Docker ne démarre pas

```bash
# Vérifier les erreurs
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Erreur de certificat SSL

```bash
# Réinitialiser les certificats
rm -rf /etc/letsencrypt/live/nunoesteves.com/
certbot certonly --standalone -d nunoesteves.com -d www.nunoesteves.com
```

---

## 📅 Maintenance Régulière

### Chaque mois:
- Vérifier les logs: `docker-compose -f docker-compose.prod.yml logs backend`
- Vérifier le certificat SSL: `certbot certificates`

### Chaque trimestre:
- Mettre à jour les dépendances
- Faire une sauvegarde complète
- Tester la restauration

### Commandes Utiles

```bash
# Voir les logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Redémarrer les services
docker-compose -f docker-compose.prod.yml restart

# Arrêter les services
docker-compose -f docker-compose.prod.yml down

# Mettre à jour le projet
git pull origin main
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## 🎉 C'est Fait!

Ton portfolio est maintenant accessible sur **https://nunoesteves.com** avec:

✅ HTTPS sécurisé avec certificat Let's Encrypt  
✅ Formulaire de contact fonctionnel avec validation XSS  
✅ E-mails automatiques de confirmation  
✅ Headers de sécurité renforcés  
✅ Logs structurés pour monitoring  
✅ Auto-renouvellement des certificats SSL  
✅ Rate limiting pour protéger l'API  

---

## 📞 Support & Aide

- **Domaine**: Contact OVH
- **Certificats SSL**: Let's Encrypt (gratuit)
- **Logs**: `/var/log/portfolio/backend.log`
- **Status**: `https://nunoesteves.com/api/health`

**Prochaines étapes recommandées:**
- [ ] Configurer les backups automatiques
- [ ] Mettre en place le monitoring (Sentry)
- [ ] Ajouter un CDN (Cloudflare)
- [ ] Configurer l'auto-scaling si trafic élevé
