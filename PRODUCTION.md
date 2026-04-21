# Configuration de production pour OVH

## Variables d'Environnement Production

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://votre_domaine.com

# Email
EMAIL_USER=notification@votre_domaine.com
EMAIL_PASS=votre_mot_passe_securise
EMAIL_TO=contact@votre_domaine.com

# Database (optional)
DATABASE_URL=mongodb://db-user:db-password@db-host:27017/portfolio

# API Keys (optional)
API_KEY=votre_clef_securisee
JWT_SECRET=votre_jwt_secret_securise
```

## Checklist de Déploiement OVH

### Avant le Déploiement
- [ ] Tester en local avec `npm run dev`
- [ ] Vérifier tous les endpoints API
- [ ] Tester le formulaire de contact
- [ ] Optimiser les images
- [ ] Générer le certificat SSL

### Configuration Initiale
- [ ] SSH configuré
- [ ] Node.js installé (v16+)
- [ ] PM2 installé globalement (`npm install -g pm2`)
- [ ] Nginx installé et configuré
- [ ] Certificats SSL générés (Let's Encrypt)
- [ ] Domaine pointé vers le serveur

### Installation du Code
```bash
# Éléments à faire une seule fois
cd /home/user/portfolio
npm install -g pm2
git clone https://github.com/user/portfolio.git .
cd backend && npm install --production
cd ../frontend && npm install --production
```

### Démarrage des Services
```bash
# Backend avec PM2
cd /home/user/portfolio
pm2 start backend/src/server.js --name "portfolio-backend"
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u user --hp /home/user

# Frontend avec Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Après Déploiement
- [ ] Tester http://votre_domaine.com
- [ ] Vérifier les logs: `pm2 logs`
- [ ] Monitorer les ressources: `pm2 monit`
- [ ] Configurer les backups automatiques
- [ ] Configurer le monitoring

## Performance Tips

1. **Caching**: Activer Redis pour les données statiques
2. **CDN**: Utiliser Cloudflare pour les assets
3. **Compression**: Activer Gzip dans Nginx
4. **Clustering**: Utiliser le mode cluster de PM2
5. **Logging**: Centraliser les logs avec ELK ou similaire

## Sécurité

1. **SSL/TLS**: Let's Encrypt renouvelé automatiquement
2. **Firewall**: UFW configuré pour autoriser 22, 80, 443
3. **Fail2Ban**: Protéger SSH des attaques par force
4. **Secrets**: Utiliser PM2 pour les variables secrètes
5. **Headers**: Configurer les headers de sécurité dans Nginx

## Monitoring

```bash
# Vérifier l'uptime
pm2 list

# Logs en temps réel
pm2 logs -f

# Memory/CPU
pm2 monit

# Redémarrer au démarrage du serveur
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username
```

## Troubleshooting Courant

### Port 5000 occupé
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

### Nginx configuration error
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### PM2 app not starting
```bash
pm2 delete all
pm2 list
job=$(cd /home/user/portfolio && pm2 start backend/src/server.js --name "portfolio")
```

## Contact d'urgence

Support OVH: https://www.ovh.com/fr/support/

---

Dernière mise à jour: 2024
