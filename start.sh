#!/bin/bash

# 🚀 Script de démarrage rapide - Portfolio
# Utilisation: ./start.sh

echo "=========================================="
echo "🚀 Portfolio - Démarrage Rapide"
echo "=========================================="
echo ""

# Vérifier si Docker est disponible
if command -v docker &> /dev/null; then
  read -p "Utiliser Docker? (y/n): " use_docker
  if [ "$use_docker" = "y" ]; then
    echo "🐳 Démarrage avec Docker Compose..."
    docker-compose up
    exit 0
  fi
fi

# Vérifier les prérequis
if ! command -v node &> /dev/null; then
  echo "❌ Node.js n'est pas installé"
  echo "📥 Installer depuis: https://nodejs.org"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm n'est pas installé"
  exit 1
fi

echo "✅ Node.js trouvé: $(node --version)"
echo "✅ npm trouvé: $(npm --version)"
echo ""

# Créer .env s'il n'existe pas
if [ ! -f ".env" ]; then
  echo "📝 Création du fichier .env..."
  cp .env.example .env
  echo "⚠️  Éditez .env pour configurer votre email"
fi

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
cd backend && npm install
cd ../frontend && npm install
cd ..

# Demander comment démarrer
echo ""
echo "=========================================="
echo "Comment voulez-vous démarrer?"
echo "=========================================="
echo "1. Mode développement (2 terminals)"
echo "2. Mode détaché (background)"
echo "3. Quitter"
echo ""
read -p "Choix (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📋 Instructions pour le mode développement:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd backend && npm run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd frontend && npm start"
    echo ""
    echo "Ou dans un seul terminal:"
    echo "  npm run dev"
    echo ""
    read -p "Démarrer les 2 services maintenant? (y/n): " start_all
    if [ "$start_all" = "y" ]; then
      npm run dev
    fi
    ;;
  2)
    echo "🎯 Démarrage en mode détaché..."
    npm install -g pm2 2>/dev/null || true
    cd backend
    pm2 start src/server.js --name "portfolio-backend"
    cd ../frontend
    pm2 start "python -m http.server 3000" --name "portfolio-frontend"
    pm2 logs
    ;;
  3)
    echo "👋 À bientôt!"
    ;;
  *)
    echo "❌ Choix invalide"
    exit 1
    ;;
esac
