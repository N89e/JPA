#!/bin/bash

# Script de test d'installation du portfolio
# Vérifie que tout est correctement configuré

echo "🔍 Vérification de l'installation du Portfolio..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

# Test function
test_command() {
  if command -v $1 &> /dev/null; then
    echo -e "${GREEN}✓${NC} $1 installé"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1 NOT FOUND"
    ((FAILED++))
  fi
}

# Test structure
test_directory() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 existe"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1 MISSING"
    ((FAILED++))
  fi
}

# Test file
test_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 existe"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1 MISSING"
    ((FAILED++))
  fi
}

echo "📦 Prérequis système:"
test_command "node"
test_command "npm"
test_command "git"
echo ""

echo "📁 Structure du projet:"
test_directory "backend"
test_directory "backend/src"
test_directory "backend/src/routes"
test_directory "backend/src/controllers"
test_directory "frontend"
test_directory "frontend/src"
test_directory "frontend/src/assets"
test_directory "frontend/src/assets/css"
test_directory "frontend/src/assets/js"
echo ""

echo "📄 Fichiers essentiels:"
test_file "backend/package.json"
test_file "backend/src/server.js"
test_file "frontend/index.html"
test_file "frontend/src/assets/css/style.css"
test_file "frontend/src/assets/js/app.js"
test_file "frontend/src/assets/js/api.js"
test_file ".env.example"
test_file "README.md"
test_file "GUIDE_DEMARRAGE.md"
echo ""

echo "🔌 Backend:"
# Vérifier que les dépendances backend sont installées
if [ -d "backend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} Dépendances backend installées"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Dépendances backend non installées"
  echo "  Exécuter: cd backend && npm install"
fi
echo ""

echo "🎨 Frontend:"
if [ -d "frontend/node_modules" ] 2>/dev/null; then
  echo -e "${GREEN}✓${NC} Dépendances frontend installées"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Dépendances frontend optionnelles"
fi
echo ""

echo "🐳 Docker:"
test_command "docker"
test_file "Dockerfile"
test_file "docker-compose.yml"
echo ""

# Résumé
TOTAL=$((PASSED + FAILED))
echo "=========================================="
echo "Résultats: ${GREEN}${PASSED}/${TOTAL}${NC} vérifications réussies"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}${FAILED} erreur(s) détectée(s)${NC}"
else
  echo -e "${GREEN}Tout semble correct! ✨${NC}"
fi
echo "=========================================="
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🚀 Pour démarrer le projet:"
  echo "  1. Terminal 1: cd backend && npm run dev"
  echo "  2. Terminal 2: cd frontend && python -m http.server 3000"
  echo ""
  echo "📍 Accès:"
  echo "  Frontend: http://localhost:3000"
  echo "  Backend:  http://localhost:5000"
  exit 0
else
  echo -e "${RED}Corrigez les erreurs détectées ci-dessus.${NC}"
  exit 1
fi
