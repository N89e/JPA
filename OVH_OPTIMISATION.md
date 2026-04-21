# 🚀 Guide d'Optimisation pour OVH Cloud

## Performance & SEO

### 1. Optimisation Frontend

#### Compression des Images
```bash
# Installer imagemin
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Compresser les images
imagemin frontend/src/assets/images --out-dir=frontend/src/assets/images/optimized
```

#### Minification CSS/JS
Les fichiers sont déjà minifiables avec:
```bash
cd frontend
npm install -D minimax uglify-js
```

#### Gzip Compression (Nginx)
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript application/json;
```

### 2. Optimisation Backend

#### Node.js Clustering
```javascript
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT);
}
```

#### Caching
```javascript
// Redis caching pour les services
import redis from 'redis';

const client = redis.createClient();
const cache = (req, res, next) => {
  const key = req.originalUrl;
  client.get(key, (err, data) => {
    if (data) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
```

### 3. Configuration OVH

#### Variables d'environnement Production
```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://votre_domaine.com
```

#### PM2 Ecosystem File
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'portfolio',
    script: 'backend/src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

### 4. Monitoring

#### PM2 Plus
```bash
pm2 plus

# Voir les metrics
pm2 monit
```

#### Logging
```bash
pm2 logs
pm2 logs --lines 100
pm2 logs --raw | grep error
```

### 5. SSL/HTTPS

```bash
# Let's Encrypt avec Certbot
sudo certbot certonly --standalone -d votre_domaine.com

# Renouvellement auto
0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Database Connection

Si vous utilisez une database:
```javascript
// Connection pooling
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

### 7. Backup Automatique

```bash
# Cron job pour backup quotidien
0 2 * * * tar -czf ~/backup-$(date +%Y%m%d).tar.gz ~/portfolio/
```

### 8. CDN Configuration

Pour les assets statiques, utiliser un CDN:
- Cloudflare (gratuit)
- AWS CloudFront
- OVH CDN

### 9. Monitoring de Sécurité

```bash
# Fail2ban pour SSH
sudo apt-get install fail2ban

# Firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 10. Checklist Déploiement

- [ ] Fichier .env configuré correctement
- [ ] SSL/HTTPS activé
- [ ] Compression Gzip activée dans Nginx
- [ ] Images optimisées
- [ ] PM2 configuré avec cluster mode
- [ ] Logs configurés
- [ ] Backup automatique en place
- [ ] Monitoring activé
- [ ] Firewall configuré
- [ ] Tests de performance (WebPageTest, GTmetrix)

---

## 📊 Benchmarks OVH

CPU: 2 vCores
RAM: 4GB
Disque: 80GB SSD

### Sous charge
- Requêtes par seconde: ~500 (sans cache)
- ~5000 (avec cache Redis)
- Temps de réponse moyen: 50-100ms
- Concurrent connections: 1000+

---

## 🔍 Tests de Performance

```bash
# Apache Bench
ab -n 1000 -c 10 http://localhost:3000/

# wrk
wrk -t4 -c100 -d30s http://localhost:5000/api/projects

# Lighthouse
lighthouse https://votre_domaine.com
```

---

## 📈 Métriques à Monitorer

- Uptime
- Response Time
- CPU Usage
- Memory Usage
- Disk Space
- Database Connections
- Error Rate

---

## Besoin d'aide?

Consulter: https://docs.ovh.com/fr/
