# 🆘 Troubleshooting: Erreur SSH "Connection Timeout"

## 🔍 Erreur Reçue

```
kex_exchange_identification: read: Connection timed out
banner exchange: Connection to 188.165.53.185 port 22: Connection timed out
```

**Cela signifie:** Le serveur n'a pas répondu au port 22 (SSH) dans le délai imparti.

---

## 📊 Diagnostic Rapide (5 min)

### Étape 1: Vérifier la connexion réseau

```powershell
# Windows PowerShell
ping 188.165.53.185

# Résultats possibles:
# ✅ "Reply from 188.165.53.185" = Serveur accessible
# ❌ "Request timed out" = Serveur inaccessible
```

### Étape 2: Vérifier le port SSH (22)

```powershell
# Windows PowerShell
Test-NetConnection -ComputerName 188.165.53.185 -Port 22

# Cherche:
# ✅ "TcpTestSucceeded: True" = Port 22 ouvert
# ❌ "TcpTestSucceeded: False" = Port 22 fermé
```

### Étape 3: Vérifier OVH Manager

1. Va sur https://www.ovhmanager.com/
2. Vérifie l'**état** du serveur:
   - ✅ État: `Livré` ou `En ligne` = BON
   - ❌ État: `Installation`, `Réinitialisation`, `Arrêté` = PROBLÈME

---

## ✅ Solutions selon le Diagnostic

### **Cas 1: Ping répond OUI, mais port 22 ne répond pas**

Le serveur réseau est accessible, mais SSH est fermé/bloqué.

**Solutions:**

```bash
# 1. Redémarrer le serveur depuis OVH Manager
# → Accès > Redémarrer

# 2. Attendre 3-5 minutes après le redémarrage

# 3. Réessayer la connexion
ssh root@188.165.53.185

# 4. Si toujours pas: Réinitialiser SSH
# → OVH Manager > Accès > Réinitialiser le mot de passe root
```

---

### **Cas 2: Ping ne répond pas + Port 22 fermé**

Le serveur n'est pas accessible du tout.

**Solutions:**

1. **Vérifier dans OVH Manager:**
   - État du serveur: `Livré` ou `En ligne`?
   - Si `Arrêté`: Clique "Démarrer"
   - Si `Installation`: Attendre 15 min
   - Si `Réinitialisation`: Attendre 10 min

2. **Attendre 5 minutes**

3. **Redémarrer le serveur:**
   ```bash
   # OVH Manager > Sélectionner serveur > Redémarrer
   ```

4. **Attendre 3-5 minutes après redémarrage**

5. **Réessayer:**
   ```powershell
   ssh root@188.165.53.185
   ```

---

### **Cas 3: Firewall bloque le port 22**

Rarissime, mais possible sur OVH.

**Solutions:**

```bash
# 1. Vérifier dans OVH Manager s'il y a un firewall
# → Réseau > Pare-feu

# 2. S'il existe, autoriser le port 22:
# Type: Ingress
# Port: 22
# Action: Accepter

# 3. Réessayer SSH
ssh root@188.165.53.185
```

---

### **Cas 4: Mot de passe expiré ou oublié**

Le serveur répond, mais l'authentification échoue.

**Solutions:**

```bash
# 1. Récupérer le mot de passe par email OVH
# Cherche l'email: "Identifiants de connexion VPS/Serveur"

# 2. Réinitialiser dans OVH Manager:
# → Serveur > Accès > Réinitialiser le mot de passe root

# 3. Attendre 5 minutes

# 4. Réessayer avec le nouveau mot de passe
ssh root@188.165.53.185
```

---

## 🎯 Guide Pas à Pas du Dépannage

### **Minuteur: 0-2 minutes**

```
☐ Ping le serveur: ping 188.165.53.185
  └─ Répond? Aller à 2-5 min
  └─ Ne répond pas? Aller à OVH Manager

☐ Test port 22: Test-NetConnection -ComputerName 188.165.53.185 -Port 22
  └─ TcpTestSucceeded: True? Aller à 2-5 min
  └─ TcpTestSucceeded: False? Aller à OVH Manager
```

### **Minuteur: 2-5 minutes**

```
☐ Ouvre https://www.ovhmanager.com/
☐ Va dans Bare Metal Cloud > VPS/Serveurs
☐ Sélectionne ton serveur
☐ Vérifie l'état:
  ├─ État: "En ligne"? → SSH devrait marcher
  ├─ État: "Installation"? → Attendre 15 min
  ├─ État: "Réinitialisation"? → Attendre 10 min
  ├─ État: "Arrêté"? → Clique "Démarrer"
  └─ Autre? → Contact support OVH

☐ Note-toi la date du contrôle
```

### **Minuteur: 5-10 minutes**

```
☐ Clique "Redémarrer" (ou "Restart")
☐ Attends 3-5 minutes (vraiment!)
☐ Réessaie SSH:
  ssh root@188.165.53.185

☐ Si ça marche: 🎉 Bravo! Continue le déploiement
☐ Si pas de succès: Aller à l'étape suivante
```

### **Minuteur: 10-15 minutes**

```
☐ Si SSH toujours pas d'accès:
  ├─ OVH Manager > Accès > Réinitialiser mot de passe root
  ├─ Récupère le nouveau mot de passe par email
  ├─ Attends 5 minutes
  └─ Réessaie SSH

☐ Si toujours rien:
  └─ Contact support OVH
     https://www.ovhcloud.com/fr/support/
```

---

## 📞 Contacter le Support OVH

Si rien ne fonctionne après 15 minutes:

```
🌐 Chat Support: https://www.ovhcloud.com/fr/support/
📞 Téléphone: 1007 (numéro gratuit - France)
📧 Email: support@ovh.com
📱 Forum: https://forum.ovh.fr/

Dis-leur:
- Domaine: nunoesteves.com
- IP: 188.165.53.185
- Erreur: "Connection timeout port 22"
- Étape essayée: Redémarrage du serveur
```

---

## ✅ Checklist Avant de Redéployer

Une fois que SSH fonctionne:

```
☐ ssh root@188.165.53.185 répond ✅
☐ Mot de passe accepté ✅
☐ Prompt bash apparaît ($) ✅
☐ Commande test: apt --version fonctionne ✅
```

Alors tu peux suivre le guide de déploiement!

---

## 🚀 Commandes de Test Post-SSH

Une fois connecté au serveur:

```bash
# Test 1: Vérifier l'OS
cat /etc/os-release

# Test 2: Vérifier la connexion internet
ping google.com

# Test 3: Vérifier les ports disponibles
netstat -tlnp | grep LISTEN

# Test 4: Vérifier l'espace disque
df -h

# Test 5: Vérifier la mémoire
free -h
```

Si tout ça marche → Continue le déploiement! 🎉

---

## 🔗 Liens Utiles

- **OVH Support**: https://www.ovhcloud.com/fr/support/
- **Status OVH**: https://status.ovhcloud.com/
- **SSH Troubleshooting**: https://help.ovhcloud.com/
- **Forum OVH**: https://forum.ovh.fr/

---

**IP du serveur**: 188.165.53.185  
**Domaine**: nunoesteves.com  
**Port SSH**: 22 (standard)  
**Utilisateur**: root (ou celui reçu par email OVH)

