# 🔍 Comment Trouver l'IP de Ton Serveur OVH

## ✅ Méthode 1: OVH Manager (le plus simple)

### 1. Accéder à OVH Manager
1. Va sur https://www.ovhmanager.com/
2. Connecte-toi avec tes identifiants OVH

### 2. Trouver l'IP du serveur

#### Si tu as un **VPS**:
- Clique sur **Bare Metal Cloud** → **VPS**
- Sélectionne ton serveur VPS
- Cherche l'onglet **Réseau** ou **Informations générales**
- L'adresse IPv4 est affichée (exemple: `198.51.100.42`)

#### Si tu as un **Serveur Dédié**:
- Clique sur **Bare Metal Cloud** → **Serveurs Dédiés**
- Sélectionne ton serveur
- Va dans **Informations générales**
- Cherche **Adresse IPv4 principale** (exemple: `192.0.2.15`)

#### Si tu as un **Cloud Privé (VPC)**:
- Clique sur **Public Cloud** → **Compute** → **Instances**
- Sélectionne ton instance
- Va dans l'onglet **Réseau**
- L'IP flottante ou l'IP du réseau privé est affichée

### 3. Copier l'IP
L'IP aura ce format: **XXX.XXX.XXX.XXX** (ex: `203.0.113.25`)

---

## ✅ Méthode 2: Email de confirmation OVH

Quand tu as acheté/loué le serveur chez OVH, tu as reçu un email de confirmation avec:
- L'**adresse IP** du serveur
- L'**identifiant root** ou administrateur
- Les **informations de connexion SSH**

**Cherche dans tes emails:**
- De: `noreply@ovh.com` ou `no-reply@ovh.com`
- Sujet: contient "VPS", "Serveur", "IP", etc.

---

## ✅ Méthode 3: Ligne de Commande (Terminal)

### Si tu as déjà accès SSH au serveur:

```bash
# Afficher ton adresse IP publique
hostname -I
# ou
ip addr show

# Afficher uniquement l'adresse IPv4 principale
ip -4 addr show | grep "inet " | grep -v "127.0" | head -1 | awk '{print $2}' | cut -d/ -f1
```

**Output**: `203.0.113.25`

---

## ✅ Méthode 4: Depuis n'importe quel PC

### Test de ping (si le serveur répond aux pings):

```bash
# Sur Windows (PowerShell):
nslookup ovh.net

# Ou demander à OVH support par chat
```

---

## 🎯 Exemple Concret

**Si ton OVH Manager affiche:**
```
Réseau > Adresse IPv4: 203.0.113.25
```

**Alors la commande SSH sera:**
```bash
ssh root@203.0.113.25
```

**Et l'adresse DNS sera pointée vers:**
```
Type: A
Domaine: nunoesteves.com
Cible: 203.0.113.25
```

---

## ⚠️ Types de Serveurs OVH & Où Trouver l'IP

| Type | Menu OVH | Où chercher |
|------|----------|------------|
| **VPS** | Bare Metal Cloud → VPS | Onglet Réseau / Infos générales |
| **Serveur Dédié** | Bare Metal Cloud → Dédiés | Infos générales → IPv4 |
| **Cloud Public** | Public Cloud → Instances | Onglet Réseau → IP flottante |
| **App Engine** | Web Cloud → App Engine | Détails du déploiement |
| **Hébergement Web** | Web Cloud → Hébergements | FTP/SFTP host (si applicable) |

---

## 🔐 IP Privée vs IP Publique

### **IP Publique** (celle dont tu as besoin):
- Format: `203.0.113.25` ou `192.0.2.10`
- Visible depuis internet
- Affichée dans l'onglet "Réseau" d'OVH Manager
- Utilisée pour SSH et DNS

### **IP Privée** (ignore celle-ci):
- Format: `10.0.0.5` ou `172.16.x.x`
- Interne au réseau OVH
- Utilisée seulement si tu as d'autres serveurs OVH

---

## ✅ CHECKLIST: Trouver Ton IP

- [ ] Je suis connecté à https://ovhmanager.com/
- [ ] J'ai trouvé le menu de mon type de serveur
- [ ] J'ai trouvé l'onglet "Réseau" ou "Infos générales"
- [ ] J'ai noté l'**adresse IPv4 publique** (format: `XXX.XXX.XXX.XXX`)
- [ ] Je l'ai copiée dans un fichier texte pour plus tard

**Exemple d'IP trouvée:**
```
203.0.113.42
```

---

## 🚀 Une Fois que tu as l'IP

Tu peux maintenant:

```bash
# 1. Tester la connexion SSH
ssh root@203.0.113.42

# 2. Configurer le DNS OVH
# Domaine: nunoesteves.com
# Type A: nunoesteves.com → 203.0.113.42

# 3. Déployer ton portfolio
./deploy-prod.ps1 -Environment ovh
```

---

## 💡 Astuces

### Vérifier ton IP depuis un navigateur:
Va sur https://whatismyipaddress.com/ ou https://www.myip.com/
Ça montre l'IP publique de ta **connexion internet**, pas de ton serveur OVH.

### Vérifier la disponibilité du serveur:
```bash
ping 203.0.113.42

# Si ça répond: ✅ Serveur accessible
# Si timeout: ⚠️ Serveur bloqé ou éteint
```

### Vérifier les ports ouverts:
```bash
nmap 203.0.113.42

# Montre les ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

---

## 🆘 Problèmes Courants

### "Je ne trouve pas l'adresse IP dans OVH Manager"
**Solution:**
- Vérifie que tu es dans le bon menu (Bare Metal Cloud ou Public Cloud)
- Cherche l'onglet "Réseau" ou "Informations"
- Si toujours rien, appelle le support OVH: https://www.ovhcloud.com/fr/support/

### "Je ne me souviens plus de mon mot de passe OVH"
**Solution:**
- Va sur https://www.ovhcloud.com/
- Clique sur "Se connecter" puis "Mot de passe oublié"
- Suis les instructions par email

### "Je n'ai pas accès SSH au serveur"
**Solution:**
1. Réinitialise le mot de passe root depuis OVH Manager
2. Essaie de te connecter: `ssh root@[IP]`
3. Si toujours pas d'accès, contacte le support OVH

---

## 📞 Support OVH

Si tu ne trouves pas:
- **Chat Support**: https://www.ovhcloud.com/fr/support/
- **Téléphone**: France: 1007 (numéro OVH) ou +33 9 72 10 94 50
- **Email**: support@ovh.com
- **Forum**: https://forum.ovh.fr/

---

**Une fois que tu as l'IP, reviens et remplace `XXX.XXX.XXX.XXX` dans les guides de déploiement!** 🚀
