# 🎬 Quick Start - Mode Production

## Lancer en Production (Localhost)

### 1️⃣ En 30 secondes (Windows)

```powershell
# Depuis le dossier racine du projet
.\deploy-prod.ps1 -Environment local
```

### 2️⃣ Accéder au site

```
🌐 Frontend:  http://localhost:3000
🔧 Backend:   http://localhost:5000
💚 Santé:     http://localhost:5000/api/health
```

### 3️⃣ Tester le formulaire

```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject"
    message = "Test message"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/contact/submit `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing | Select-Object StatusCode
```

---

## Mode Production (OVH Cloud)

### 1️⃣ Configurer OVH

```bash
# Éditer backend/.env.production.ovh avec vos paramètres:
# - Domaine OVH
# - Email Gmail
# - Certificat SSL
```

### 2️⃣ Déployer

```powershell
.\deploy-prod.ps1 -Environment ovh
```

### 3️⃣ Vérifier

```bash
curl https://votre-domaine.com/api/health
```

---

## 📊 Commandes Utiles

| Commande | Effet |
|----------|-------|
| `make prod-local` | Lancer production locale |
| `make prod-ovh` | Déployer sur OVH |
| `make health` | Vérifier santé du backend |
| `make logs` | Voir les logs (temps réel) |
| `make stop` | Arrêter les services |
| `make restart` | Redémarrer |

---

## 📋 Checklist Avant Production

- [ ] `.env.production.local` configuré
- [ ] Docker running
- [ ] Pas d'erreur `docker ps`
- [ ] Port 5000/3000 libres
- [ ] Accès: `http://localhost:3000` ✅

---

## 🆘 Problèmes?

**Backend unhealthy?**
```powershell
docker logs portfolio-backend-1
```

**Port déjà utilisé?**
```powershell
netstat -ano | findstr :5000
```

**Logs détaillés?**
```powershell
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

👉 Voir [PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md) pour le guide complet
