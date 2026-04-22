#!/bin/bash

# Configuration Let's Encrypt SSL Certificate
# Script pour initialiser les certificats SSL avec Let's Encrypt et Certbot

# ===== CONFIGURATION À MODIFIER =====
DOMAIN="your-domain.com"          # ← CHANGER VOTRE DOMAINE!
EMAIL="your-email@gmail.com"      # ← CHANGER VOTRE EMAIL!
RSAKEY_SIZE=4096
CERTBOT_DIR="./certbot"

# ===== VÉRIFIFICATIONS =====
echo "🔐 Initializing Let's Encrypt SSL Certificate..."
echo "   Domain: $DOMAIN"
echo "   Email: $EMAIL"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker found"

# ===== CRÉER LES RÉPERTOIRES =====
echo "📁 Creating directories..."
mkdir -p "$CERTBOT_DIR/conf"
mkdir -p "$CERTBOT_DIR/www"

# ===== GÉNÉRER LE CERTIFICAT =====
echo "🔑 Generating SSL certificate..."
echo ""
echo "Important: Your domain must be accessible from the internet!"
echo "Make sure your DNS A record points to your server IP before continuing."
echo ""
read -p "Press Enter to continue..."
echo ""

docker run -it --rm \
    -v "$CERTBOT_DIR/conf:/etc/letsencrypt" \
    -v "$CERTBOT_DIR/www:/var/www/certbot" \
    certbot/certbot certonly \
    --standalone \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --rsa-key-size "$RSAKEY_SIZE"

# ===== VÉRIFIER LE RÉSULTAT =====
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Certificate generated successfully!"
    echo ""
    echo "📝 Certificate location:"
    echo "   $CERTBOT_DIR/conf/live/$DOMAIN/"
    echo ""
    echo "🔑 Private key:"
    echo "   $CERTBOT_DIR/conf/live/$DOMAIN/privkey.pem"
    echo ""
    echo "📜 Full chain:"
    echo "   $CERTBOT_DIR/conf/live/$DOMAIN/fullchain.pem"
    echo ""
    echo "⚠️  NEXT STEPS:"
    echo "   1. Update nginx.conf.prod:"
    echo "      - Replace YOUR_DOMAIN.COM with: $DOMAIN"
    echo "   2. Start production:"
    echo "      docker-compose -f docker-compose.prod.yml up -d"
    echo "   3. Verify HTTPS:"
    echo "      curl -I https://$DOMAIN/"
    echo ""
else
    echo ""
    echo "❌ Certificate generation failed!"
    echo "   Please check the error messages above."
    echo ""
    echo "💡 Troubleshooting:"
    echo "   - Verify your domain DNS points to this server"
    echo "   - Ensure port 80 and 443 are not blocked"
    echo "   - Check firewall rules"
    exit 1
fi

exit 0
