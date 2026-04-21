#!/bin/bash

# Script de vérification du déploiement OVH
# Usage: bash verify-deployment.sh nunoesteves.com

DOMAIN=${1:-"nunoesteves.com"}

echo "🔍 Vérification du déploiement: $DOMAIN"
echo "=================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_dns() {
    echo "📍 Vérification DNS..."
    if nslookup $DOMAIN &> /dev/null; then
        IP=$(nslookup $DOMAIN | grep "Address" | tail -1 | awk '{print $2}')
        echo -e "${GREEN}✓ DNS résolu: $IP${NC}"
    else
        echo -e "${RED}✗ DNS non résolu${NC}"
        return 1
    fi
}

check_http() {
    echo ""
    echo "🌐 Vérification HTTP/HTTPS..."
    
    # Check HTTP redirect
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L http://$DOMAIN)
    if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 301 ]; then
        echo -e "${GREEN}✓ HTTP/HTTPS accessible (code: $STATUS)${NC}"
    else
        echo -e "${RED}✗ HTTP/HTTPS non accessible (code: $STATUS)${NC}"
        return 1
    fi
}

check_ssl() {
    echo ""
    echo "🔒 Vérification SSL..."
    
    CERT=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>&1)
    
    if echo "$CERT" | grep -q "Verify return code: 0 (ok)"; then
        echo -e "${GREEN}✓ Certificat SSL valide${NC}"
        
        # Extract expiry
        EXPIRY=$(echo "$CERT" | grep "notAfter" | awk -F'=' '{print $2}')
        echo "   Expire le: $EXPIRY"
    else
        echo -e "${RED}✗ Certificat SSL invalide${NC}"
        return 1
    fi
}

check_api() {
    echo ""
    echo "💚 Vérification API Backend..."
    
    HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health)
    if [ "$HEALTH" -eq 200 ]; then
        echo -e "${GREEN}✓ API Backend en bonne santé (code: 200)${NC}"
        
        # Get detailed health
        curl -s https://$DOMAIN/api/health | grep -o '"status":"[^"]*"'
    else
        echo -e "${RED}✗ API Backend non accessible (code: $HEALTH)${NC}"
        return 1
    fi
}

check_security_headers() {
    echo ""
    echo "🛡️  Vérification des headers de sécurité..."
    
    HEADERS=$(curl -s -I https://$DOMAIN)
    
    # Check for security headers
    if echo "$HEADERS" | grep -q "X-Frame-Options"; then
        echo -e "${GREEN}✓ X-Frame-Options présent${NC}"
    else
        echo -e "${YELLOW}⚠ X-Frame-Options manquant${NC}"
    fi
    
    if echo "$HEADERS" | grep -q "X-Content-Type-Options"; then
        echo -e "${GREEN}✓ X-Content-Type-Options présent${NC}"
    else
        echo -e "${YELLOW}⚠ X-Content-Type-Options manquant${NC}"
    fi
    
    if echo "$HEADERS" | grep -q "Content-Security-Policy"; then
        echo -e "${GREEN}✓ Content-Security-Policy présent${NC}"
    else
        echo -e "${YELLOW}⚠ Content-Security-Policy manquant${NC}"
    fi
    
    if echo "$HEADERS" | grep -q "Strict-Transport-Security"; then
        echo -e "${GREEN}✓ HSTS présent${NC}"
    else
        echo -e "${YELLOW}⚠ HSTS manquant${NC}"
    fi
}

check_form() {
    echo ""
    echo "📝 Test du formulaire de contact..."
    
    RESPONSE=$(curl -s -X POST https://$DOMAIN/api/contact \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "Test message"
        }')
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✓ Formulaire de contact fonctionnel${NC}"
    else
        echo -e "${RED}✗ Erreur formulaire${NC}"
        echo "   Réponse: $RESPONSE"
        return 1
    fi
}

check_xss_protection() {
    echo ""
    echo "🛡️  Test protection XSS..."
    
    RESPONSE=$(curl -s -X POST https://$DOMAIN/api/contact \
        -H "Content-Type: application/json" \
        -d '{
            "name": "<script>alert(1)</script>",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Test"
        }')
    
    if echo "$RESPONSE" | grep -q '"success":false'; then
        echo -e "${GREEN}✓ Protection XSS active${NC}"
    else
        echo -e "${RED}✗ ⚠️  XSS non bloquée!${NC}"
        return 1
    fi
}

# Run all checks
check_dns
check_http
check_ssl
check_api
check_security_headers
check_form
check_xss_protection

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Vérification terminée!${NC}"
echo ""
echo "📊 Résumé:"
echo "  - Domaine: https://$DOMAIN"
echo "  - Santé: https://$DOMAIN/api/health"
echo "  - Logs: docker-compose logs -f backend"
echo ""
