# 🔐 Configuration des Secrets GitHub

Pour le déploiement automatique sur OVH via GitHub Actions, vous devez configurer les secrets.

## Étape 1: Générer une clé SSH

### Sur le serveur OVH:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_deploy_key -N ""
cat ~/.ssh/github_deploy_key.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy_key
# Copier la clé privée
```

### Sur votre machine locale:
```bash
ssh-keygen -t rsa -b 4096 -f ~/github_deploy_ssh -N ""
cat ~/github_deploy_ssh
# Copier la clé privée
```

## Étape 2: Ajouter les Secrets GitHub

1. Aller sur: https://github.com/your-username/portfolio/settings/secrets/actions

2. Cliquer "New repository secret"

3. Ajouter les secrets suivants:

| Secret Name | Value |
|-------------|-------|
| `OVH_DEPLOY_KEY` | Votre clé SSH privée |
| `OVH_HOST` | votre_serveur_ovh.com |
| `OVH_USER` | votre_utilisateur |
| `OVH_EMAIL_USER` | votre_email@gmail.com |
| `OVH_EMAIL_PASS` | votre_app_password |

## Exemple d'ajout de secret

1. Name: `OVH_DEPLOY_KEY`
2. Secret: Coller la clé SSH (BEGIN RSA PRIVATE KEY ... END RSA PRIVATE KEY)
3. Cliquer "Add secret"

## Utilisation dans le code

Le workflow `.github/workflows/deploy.yml` utilisera ces secrets:

```yaml
env:
  DEPLOY_KEY: ${{ secrets.OVH_DEPLOY_KEY }}
  DEPLOY_HOST: ${{ secrets.OVH_HOST }}
```

## Tests du Déploiement

```bash
# Faire un push vers main
git add .
git commit -m "Test deployment"
git push origin main

# Voir les logs du workflow:
# 1. Aller sur GitHub
# 2. Actions tab
# 3. Voir le workflow "Déploiement Portfolio"
```

## Troubleshooting

### "Permission denied"
- Vérifier que la clé SSH est correcte
- Vérifier que `authorized_keys` sur le serveur contient la clé publique

### "SSH key not found"
- S'assurer que le secret `OVH_DEPLOY_KEY` existe
- Vérifier le format (BEGIN RSA PRIVATE KEY)

### Workflow ne s'exécute pas
- Vérifier que le push est vers `main`
- Vérifier que `.github/workflows/deploy.yml` existe
- Vérifier les logs du workflow

---

## Sécurité

**⚠️ Important:**
- ❌ JAMAIS committer les clés SSH
- ❌ JAMAIS partager les secrets
- ✅ Utiliser GitHub Secrets pour les données sensibles
- ✅ Régénérer les clés si compromises

## Alternative: Déploiement Manuel

Si GitHub Actions ne fonctionne pas:

```bash
# Depuis votre machine
cd portfolio
bash deploy.sh

# Ou sur Windows
.\deploy.ps1
```

---

## Support OVH SSH

Voir: https://docs.ovh.com/fr/vps/getting-started-vps/
