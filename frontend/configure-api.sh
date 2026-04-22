#!/bin/bash

# ==========================================
# Script de Configuration API Frontend
# ==========================================
# Ce script remplace l'URL de l'API dans le frontend
# Utilisé lors du déploiement en production

API_URL="${1:-}"

if [ -z "$API_URL" ]; then
    echo "❌ Erreur: Vous devez spécifier l'URL de l'API"
    echo ""
    echo "Usage: ./configure-api.sh <API_URL>"
    echo ""
    echo "Exemples:"
    echo "  ./configure-api.sh 'https://portfolio-api-uj5s.onrender.com/api'"
    echo "  ./configure-api.sh 'http://localhost:5000/api'"
    exit 1
fi

echo "🔧 Configuration de l'API Frontend..."
echo "📡 API URL: $API_URL"

# Méthode 1: Injecter dans le meta tag de index.html
echo "✏️  Mise à jour du meta tag dans index.html..."

if [ -f "index.html" ]; then
    # Remplacer le meta tag api-url
    sed -i.bak "s|<meta name=\"api-url\" content=\"[^\"]*\"|<meta name=\"api-url\" content=\"$API_URL\"|g" index.html
    echo "✅ Meta tag mis à jour dans index.html"
else
    echo "❌ Fichier index.html non trouvé"
    exit 1
fi

# Méthode 2 (optionnelle): Injecter une variable window au démarrage
echo "✏️  Création d'un script d'injection global..."

cat > src/assets/js/api/inject-config.js << 'EOF'
// Script d'injection de la configuration API
// Cet script doit être exécuté AVANT config.js

(function() {
  // Récupérer l'URL depuis le meta tag
  const metaTag = document.querySelector('meta[name="api-url"]');
  if (metaTag) {
    window.__API_BASE_URL__ = metaTag.getAttribute('content');
    console.log('✅ Configuration API injectée globalement');
  }
})();
EOF

echo "✅ Script d'injection créé: src/assets/js/api/inject-config.js"

echo ""
echo "=========================================="
echo "✅ Configuration terminée!"
echo "=========================================="
echo ""
echo "📋 Résumé:"
echo "   API URL: $API_URL"
echo "   Fichier: index.html (meta tag)"
echo "   Status: ✅ Prêt pour le déploiement"
echo ""
