# Test de Sécurité XSS - Formulaire de Contact

## ✅ Protections Implémentées

### 1. **Validation Côté Client** (Frontend)
- ✔️ Détection de 11 patterns malveillants
- ✔️ Blocage des `<script>` tags
- ✔️ Blocage des event handlers (`onclick`, `onerror`, etc.)
- ✔️ Blocage des protocoles dangereux (`javascript:`, `vbscript:`)
- ✔️ Blocage des iframe, embed, object tags

### 2. **Validation Côté Serveur** (Backend)
- ✔️ Double validation des patterns XSS
- ✔️ Détection d'encodage URL dangereux (`%3C`, `&#x3c`)
- ✔️ HTML escaping des caractères `<`, `>`, `&`, `"`, `'`
- ✔️ Suppression des caractères de contrôle

### 3. **Headers de Sécurité**
- ✔️ `X-Content-Type-Options: nosniff` - Prévient le sniffing
- ✔️ `X-Frame-Options: SAMEORIGIN` - Protège contre clickjacking
- ✔️ `X-XSS-Protection: 1; mode=block` - Protection XSS du navigateur
- ✔️ `Content-Security-Policy` - Politique stricte (voir ci-dessous)
- ✔️ `Strict-Transport-Security` (en production) - Force HTTPS
- ✔️ `Referrer-Policy: strict-origin-when-cross-origin`

### 4. **Content Security Policy (CSP)**
```
default-src 'self'              - Seules ressources du même origin
script-src 'self'               - Scripts uniquement locaux
style-src 'self' 'unsafe-inline' - Styles locaux (unsafe-inline car CSS interne)
img-src 'self' data: https:     - Images locales + data URLs + HTTPS
font-src 'self'                 - Polices locales uniquement
connect-src 'self'              - Connexions API au même origin
frame-ancestors 'none'          - Empêche embedding dans frame
base-uri 'self'                 - Base URL du document restreinte
form-action 'self'              - Forms soumises au même origin
```

## 🧪 Tentatives d'Attaque Bloquées

### Test 1: Script Tag Direct
```
Name: <script>alert('XSS')</script>
Résultat: ❌ Bloqué à la validation client
```

### Test 2: Event Handler
```
Subject: Test<img src=x onerror="alert('XSS')">
Résultat: ❌ Bloqué (pattern /on\w+\s*=/)
```

### Test 3: JavaScript Protocol
```
Message: javascript:void(0)
Résultat: ❌ Bloqué (pattern /javascript:/gi)
```

### Test 4: Encodage URL
```
Name: %3Cscript%3Ealert('XSS')%3C/script%3E
Résultat: ❌ Bloqué (pattern /%3Cscript/gi)
```

### Test 5: HTML Entity Encoding
```
Subject: &#60;script&#62;
Résultat: ❌ Bloqué (pattern /&#x3c/gi et /&#60/gi)
```

### Test 6: Iframe Injection
```
Message: <iframe src="https://malicious.com"></iframe>
Résultat: ❌ Bloqué à validation serveur
```

### Test 7: Eval Function
```
Message: eval(alert('XSS'))
Résultat: ❌ Bloqué (pattern /eval\(/gi)
```

## 📊 Couches de Protection (Defence in Depth)

```
┌─────────────────────────────────────────────┐
│  1. Navigateur (CSP + X-XSS-Protection)    │
├─────────────────────────────────────────────┤
│  2. Frontend Validation (Pattern Detection) │
├─────────────────────────────────────────────┤
│  3. API Rate Limiting (DDoS Prevention)     │
├─────────────────────────────────────────────┤
│  4. Backend Validation (Patterns + Length)  │
├─────────────────────────────────────────────┤
│  5. HTML Escaping (Special Characters)      │
├─────────────────────────────────────────────┤
│  6. Database Storage (Safely Encoded)       │
└─────────────────────────────────────────────┘
```

## 🔒 Recommandations Supplémentaires (Optionnel)

### Court terme:
- ✅ Ajouter `npm audit` dans CI/CD
- ✅ Configurer `.env` avec CSP pour production

### Moyen terme:
- 🔄 Ajouter Helmet.js pour plus de headers
- 🔄 Implémenter CSRF tokens
- 🔄 Ajouter rate limiting plus strict

### Long terme:
- 🔄 Audit de sécurité professionnel
- 🔄 Tests de pénétration
- 🔄 Scanner OWASP automatisé

## 📝 Fichiers Modifiés

1. **frontend/src/assets/js/services/contactService.js**
   - ✅ Ajout de DANGEROUS_PATTERNS
   - ✅ Fonction containsDangerousPatterns()
   - ✅ Validation stricte avec XSS check

2. **backend/src/middleware/validation.js**
   - ✅ Patterns de détection XSS avancés
   - ✅ Encodage URL malveillant détecté
   - ✅ Double validation avant sanitization

3. **backend/src/server.js**
   - ✅ Content-Security-Policy implémentée
   - ✅ HSTS en production
   - ✅ Headers de sécurité renforcés

4. **backend/src/server-prod.js**
   - ✅ Même amélioration que server.js

## ✅ Vérification

Tester localement:
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Tester avec curl
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(1)</script>",
    "email": "test@test.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

Résultat attendu:
```json
{
  "success": false,
  "message": "Le nom contient des patterns non autorisés",
  "errors": ["Le nom contient des patterns non autorisés"]
}
```

---

**Statut**: ✅ PROTÉGÉ CONTRE LES ATTAQUES XSS COURANTES
