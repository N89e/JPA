# 🚀 GUIDE DÉPLOIEMENT CLOUD - PORTFOLIO NUNO ESTEVES

## Résumé des options

| Provider | Coût/mois | Facilité | Performance | Recommandé | Setup Time |
|----------|-----------|---------|-------------|------------|-----------|
| **Heroku** | $25-100 | 🟢 Très facile | 🟡 Moyen | MVP | 15 min |
| **Render** | $20-80 | 🟢 Très facile | 🟢 Bon | ✅ Recommandé | 15 min |
| **Railway** | $15-60 | 🟢 Très facile | 🟡 Moyen | MVP | 15 min |
| **DigitalOcean** | $40-120 | 🟡 Facile | 🟢 Excellent | ✅ Recommandé | 30 min |
| **Netlify/Vercel** | $15-80 | 🟢 Très facile | 🟢 Excellent | Frontend | 10 min |
| **AWS** | $50-300 | 🔴 Complexe | 🟢 Excellent | Production | 2h |
| **Linode** | $30-100 | 🟡 Facile | 🟢 Excellent | Production | 45 min |
| **OVH** | $30-100 | 🟡 Facile | 🟢 Excellent | Production | 1h |

---

## 1️⃣ RENDER (⭐ RECOMMANDÉ - Le plus simple)

**Coût**: $7-50/mois  
**Avantages**: 
- ✅ Git push deploy (super simple)
- ✅ Gratuit pendant les 90 premiers jours
- ✅ HTTPS automatique
- ✅ Auto-deploy sur chaque push
- ✅ PostgreSQL/Redis support
- ✅ Web service + Background jobs

**Inconvénients**:
- ⚠️ Peut être lent sur plan gratuit
- ⚠️ Peu cher mais pas ultra-compétitif
- ⚠️ Moins populaire qu'Heroku

### Setup Render (5 min)

```bash
# 1. Push votre code sur GitHub
git push origin main

# 2. Créer render.yaml dans root du projet
# Voir section render.yaml ci-dessous

# 3. Aller sur https://render.com
# 4. S'enregistrer avec GitHub
# 5. Créer nouveau service
# 6. Choisir "Blueprint" et connecter le repo
# 7. Render va lire render.yaml et déployer automatiquement

# 8. Configurer domaine
# Render Dashboard → Services → [Your Service] → Settings → Domains
```

### render.yaml (À copier dans le root)

```yaml
services:
  - type: web
    name: portfolio-api
    env: node
    repo: YOUR_GITHUB_REPO_URL
    plan: standard  # starter = gratuit pendant 90 jours
    buildCommand: cd backend && npm install --production
    startCommand: node backend/src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        value: https://portfolio-frontend.onrender.com
      - key: EMAIL_USER
        sync: false  # Must be set in dashboard
      - key: EMAIL_PASSWORD
        sync: false
      - key: PORT
        value: 10000
    numInstances: 1
    plan: starter

  - type: web
    name: portfolio-frontend
    staticSite: true
    buildCommand: echo "Frontend ready"
    publishPath: ./frontend
    envVars: []

databases:
  - name: portfolio-db
    databaseName: portfolio_db
    user: portfolio_user
    plan: starter

envGroups:
  - name: Production
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: LOG_LEVEL
        value: info
```

---

## 2️⃣ HEROKU (Classique mais payant)

**Coût**: $25-100/mois (gratuit tier supprimé Oct 2022)  
**Avantages**: 
- ✅ Super connu et stable
- ✅ Git push deploy
- ✅ Add-ons (PostgreSQL, Redis, etc.)
- ✅ Excellent support

**Inconvénients**:
- ❌ Plus cher que alternatives
- ❌ Gratuit tier supprimé
- ❌ Performance variable

### Setup Heroku (10 min)

```bash
# 1. Installer Heroku CLI
npm install -g heroku

# 2. Se connecter
heroku login

# 3. Créer une nouvelle app
heroku create portfolio-api

# 4. Configurer variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://yourdomai.com
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password

# 5. Créer Procfile dans root
echo "web: node backend/src/server.js" > Procfile

# 6. Créer app.json pour frontend
cat > app.json << 'EOF'
{
  "name": "Portfolio",
  "description": "Personal portfolio",
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ]
}
EOF

# 7. Push vers Heroku
git push heroku main

# 8. Ouvrir l'app
heroku open

# 9. Voir les logs
heroku logs -t
```

### Procfile

```
web: node backend/src/server.js
```

---

## 3️⃣ DIGITALOCEAN (💪 Production-ready)

**Coût**: $40-120/mois  
**Avantages**: 
- ✅ App Platform (facile comme Heroku)
- ✅ PostgreSQL managed
- ✅ Spaces CDN pour images
- ✅ Excellent prix/performance
- ✅ Contrôle total
- ✅ Support français

**Inconvénients**:
- ⚠️ Légèrement plus complexe
- ⚠️ Moins automatisé

### Setup DigitalOcean (30 min)

```bash
# 1. Créer compte sur https://digitalocean.com
# 2. Créer Droplet: Ubuntu 22.04 LTS, 2GB RAM, $12/mois
# 3. Se connecter en SSH

# ---- Sur le serveur ----

# 4. Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 5. Installer PM2 (process manager)
sudo npm install -g pm2

# 6. Installer Nginx
sudo apt-get install -y nginx

# 7. Cloner le repository
cd /home/user
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# 8. Installer dépendances
cd backend && npm install --production
cd ../frontend && npm install --production
cd ..

# 9. Configurer variables d'environnement
cp .env.example.production .env.production
nano .env.production  # Éditer les valeurs

# 10. Démarrer avec PM2
pm2 start backend/src/server.js --name "portfolio-api" --env .env.production
pm2 save
pm2 startup

# 11. Configurer Nginx
sudo cp nginx.conf.prod /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 12. Configurer SSL avec Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com

# 13. Vérifier que tout fonctionne
pm2 logs
curl http://localhost:3000

# 14. Configurer domaine
# DigitalOcean Dashboard → Networking → Domains
# Ajouter A record pointant vers votre Droplet IP
```

### Configuration Nginx pour DigitalOcean

```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    root /home/user/portfolio/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 4️⃣ AWS (🚀 Scalable Enterprise)

**Coût**: $50-500+/mois  
**Avantages**: 
- ✅ Scalabilité illimitée
- ✅ Services mondiaux
- ✅ Très mature
- ✅ Enterprise-ready

**Inconvénients**:
- ❌ Très complexe
- ❌ Coûts peuvent exploser
- ❌ Courbe d'apprentissage raide

### Architecture AWS recommandée

```
Internet (Users)
     ↓
Route 53 (DNS)
     ↓
CloudFront (CDN)
     ↓
ALB (Application Load Balancer)
     ↓
ECS Fargate (Express API) × 2-3 instances
     ↓
RDS PostgreSQL (managed database)
↓
ElastiCache Redis (caching)
↓
S3 (images storage)
↓
CloudWatch (monitoring & logging)
```

### Setup AWS (requires 1-2h)

```bash
# 1. Créer compte AWS
# 2. IAM setup (security best practice)
# 3. ECS Cluster
# 4. RDS PostgreSQL
# 5. ALB (load balancer)
# 6. CloudFront distribution
# 7. Route 53 domain
# 8. CloudWatch monitoring

# Voir AWS documentation or use Copilot CLI:
# npm install -g @aws-cdk/cli
# cdk init app --language=typescript
# cdk deploy
```

---

## 5️⃣ VERCEL + NETLIFY (Frontend CDN)

**Coût**: Gratuit - $50/mois  
**Avantages**: 
- ✅ Ultra rapide (CDN global)
- ✅ Git push deploy
- ✅ HTTPS automatique
- ✅ Gratuit pour start

**Inconvénients**:
- ⚠️ Frontend seul (backend ailleurs)
- ⚠️ Serverless (cold starts)
- ⚠️ Pas adapté pour backend

### Vercel (Frontend)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Deploy
cd frontend
vercel --prod

# 4. Configurer domaine
# Vercel Dashboard → Project Settings → Domains
```

### Séparer Frontend/Backend

**Recommandation**: 
- Frontend → Vercel/Netlify (gratuit + CDN)
- Backend → Render/Heroku/DigitalOcean (API)

```javascript
// frontend/src/assets/js/api/config.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  'https://api.yourdomain.com';  // Backend URL
```

---

## 6️⃣ OVH (Budget France)

**Coût**: $30-100/mois  
**Avantages**: 
- ✅ Serveurs en France
- ✅ Prix imbattable
- ✅ Contrôle total
- ✅ Excellent support FR

**Inconvénients**:
- ⚠️ Plus de configuration manuelle
- ⚠️ Pas autant automatisé

### Setup OVH

```bash
# 1. Créer VPS sur https://www.ovhcloud.com/fr/
# 2. Attendre accès SSH
# 3. Suivre même procédure que DigitalOcean
# 4. Utiliser deploy.sh fourni

bash deploy.sh
```

---

## 📋 CHECKLIST AVANT DÉPLOIEMENT

```
✅ CODE QUALITY
- [ ] Tests passent: npm test
- [ ] Pas de console.log() de debug
- [ ] Variables d'env configurées
- [ ] .env.production créé
- [ ] Secrets sécurisés

✅ SÉCURITÉ
- [ ] HTTPS activé
- [ ] Rate limiting activé
- [ ] CORS configuré correctement
- [ ] Headers de sécurité ajoutés
- [ ] No SQL injection possible
- [ ] XSS protection active

✅ PERFORMANCE
- [ ] Images optimisées
- [ ] Assets minifiés
- [ ] Gzip compression activé
- [ ] Cache headers configurés
- [ ] CDN configuré (optional)

✅ MONITORING
- [ ] Logging configuré
- [ ] Uptime monitoring
- [ ] Error tracking (Sentry)
- [ ] Health check endpoint
- [ ] Alerts configurées

✅ INFRASTRUCTURE
- [ ] Database backup automatique
- [ ] SSL certificate setup
- [ ] Domain pointé vers serveur
- [ ] Email service fonctionnel
- [ ] PM2/systemd restart automatique
```

---

## 🔧 COMMANDES UTILES POST-DÉPLOIEMENT

### Vérifier l'app

```bash
# Test endpoint
curl https://yourdomain.com/api/health

# Check certificate
openssl s_client -connect yourdomain.com:443

# Check DNS
nslookup yourdomain.com
```

### Monitoring en live

```bash
# PM2
pm2 logs
pm2 monit
pm2 restart all

# Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System
free -h
df -h
top
```

### Mise à jour du code

```bash
# Pull latest
git pull origin main

# Install deps
npm install --production

# Restart
pm2 restart all
# Or
sudo systemctl restart nginx
```

---

## 🆘 TROUBLESHOOTING

### App ne démarre pas
```bash
# Vérifier les logs
pm2 logs

# Vérifier les erreurs
npm start

# Vérifier variables d'env
env | grep EMAIL

# Relancer
pm2 restart all
```

### Emails ne s'envoient pas
```bash
# Vérifier Gmail config
# Settings → Security → App passwords
# Use 16-char password, not main password

# Tester envoi manuel
node -e "
import('./backend/src/services/emailService.js')
  .then(m => m.sendUserConfirmationEmail('your@email.com', 'Test'))
"
```

### CORS errors
```javascript
// Vérifier FRONTEND_URL
console.log(process.env.FRONTEND_URL)

// Vérifier headers
curl -H "Origin: https://yourdomain.com" https://api.yourdomain.com/api/health
```

### Database connection
```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

---

## 📚 RESSOURCES

- **Render**: https://render.com/docs
- **Heroku**: https://devcenter.heroku.com/
- **DigitalOcean**: https://docs.digitalocean.com/
- **AWS**: https://docs.aws.amazon.com/
- **Let's Encrypt**: https://letsencrypt.org/
- **PM2**: https://pm2.keymetrics.io/

---

## 🎯 PROCHAINES ÉTAPES

1. **Choisir provider** → Render ou DigitalOcean recommended
2. **Setup CI/CD** → GitHub Actions auto-deploy
3. **Database** → PostgreSQL ou MongoDB
4. **Monitoring** → Sentry + DataDog
5. **Scaling** → Auto-scaling rules
6. **SEO** → Meta tags + XML sitemap
7. **Analytics** → Google Analytics / Plausible
8. **Backup** → Automated daily backups

---

**Besoin d'aide?** Consulter AUDIT_CLOUD_READINESS.md
