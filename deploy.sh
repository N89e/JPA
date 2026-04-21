#!/bin/bash

# Script de déploiement sur OVH
# Assurez-vous d'avoir configuré votre accès SSH d'abord

# Configuration
REMOTE_USER="votre_utilisateur"
REMOTE_HOST="votre_serveur_ovh.com"
REMOTE_PATH="/home/$REMOTE_USER/portfolio"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Début du déploiement..."

# 1. Compiler/Vérifier le backend
echo "📦 Vérification du backend..."
cd "$PROJECT_DIR/backend"
npm install

# 2. Compiler/Vérifier le frontend
echo "📦 Vérification du frontend..."
cd "$PROJECT_DIR/frontend"
npm install

# 3. Créer un archive
echo "📦 Création de l'archive..."
cd "$PROJECT_DIR"
tar -czf portfolio.tar.gz backend/ frontend/ .env.example

# 4. Transférer vers le serveur OVH
echo "📤 Transfert vers OVH..."
scp portfolio.tar.gz "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

# 5. Décompresser et démarrer
echo "🔧 Configuration sur le serveur..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
  cd $REMOTE_PATH
  tar -xzf portfolio.tar.gz
  cd backend
  npm install --production
  npm start &
  cd ../frontend
  npm start &
  echo "✅ Déploiement terminé!"
EOF

echo "✅ Déploiement réussi!"
echo "📍 Votre portfolio est accessible sur: https://votre_domaine.com"

# Nettoyage local
rm portfolio.tar.gz
