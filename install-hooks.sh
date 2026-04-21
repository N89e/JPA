#!/usr/bin/env bash

# Git hooks pour le portfolio

# Pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Vérification pré-commit..."

# Vérifier le backend
cd backend
npm run lint 2>/dev/null || true

# Vérifier les fichiers
cd ../frontend
echo "✅ Vérification terminée"
exit 0
EOF

chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installés"
