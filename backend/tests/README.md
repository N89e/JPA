# 🧪 Tests Backend - Portfolio

Suite de tests unitaires pour l'API backend développée avec **Vitest**.

---

## 🎯 Objectifs

✅ Tester la validation des inputs (formulaire contact)  
✅ Tester le rate limiting  
✅ Tester la sanitisation XSS  
✅ Tester les erreurs et cas limites  
✅ Assurer la sécurité & robustesse  

---

## 📋 Vue d'ensemble

**Fichier de test:** `validation.test.js` (50+ cas de test)

Ce dossier contient les tests unitaires pour la validation des données du formulaire de contact.

---

## 🚀 Installation & Lancement

### 1️⃣ Installer Vitest et dépendances
```bash
cd backend
npm install
```

### 2️⃣ Lancer les tests

```bash
# Lancer tous les tests
npm test

# Mode watch (re-lance au changement)
npm test -- --watch

# Mode UI (interface graphique)
npm run test:ui

# Avec couverture de code
npm run test:coverage
```

---

## 📊 Couverture des tests

Les tests couvrent **tous les scénarios de validation:**

### ✅ Champs manquants
- Rejet si `name` manquant
- Rejet si `email` manquant
- Rejet si `subject` manquant
- Rejet si `message` manquant

### ✅ Longueurs des champs
- Rejet si name > 100 caractères
- Rejet si subject > 200 caractères
- Rejet si message > 5000 caractères
- Acceptation aux limites exactes
- Rejet si message < 10 caractères

### ✅ Format email
- Accepte emails valides: `john.doe@example.com`
- Rejette sans `@`: `john.doe.example.com`
- Rejette sans domaine: `john@`
- Rejette avec espaces: `john doe@example.com`

### ✅ Sécurité XSS/Injection
- Rejette `<script>` tags
- Rejette `javascript:` protocols
- Rejette `iframe` tags
- Rejette `encoded script (%3Cscript)`
- Sanitisation DOMPurify appliquée

### ✅ Caractères autorisés (Name & Subject)
- ✅ Accents: `Jéan-Piérre D'Amélie`
- ✅ Tirets: `Jean-Pierre Dupont`
- ✅ Apostrophes: `D'Artagnan O'Brien`
- ✅ **Subject UNIQUEMENT:** Chiffres: `Agile 2024 Methodology`
- ✅ **Subject:** Cas complexes: `Sprint 3 Démonstration`

### ✅ Caractères rejetés
- ❌ Chiffres dans name: `John Doe 2024`
- ❌ Caractères de contrôle: `John\x00Doe`
- ❌ Symboles spéciaux: `John$Doe`, `Test@User`

### ✅ Sanitization (nettoyage)
- Trim des espaces avant/après
- Conversion email en minuscules
- Encodage HTML pour prévention XSS
- Suppression des caractères de contrôle

---

## 🎯 Cas clés testés

Le test **"FIX #5"** valide que les chiffres sont acceptés dans le sujet:

```javascript
✅ subject: 'Agile 2024 Methodology'     → ACCEPTÉ
✅ subject: 'Sprint 3 Démonstration'     → ACCEPTÉ
✅ subject: 'HTML5 CSS3 Project'         → ACCEPTÉ
❌ name: 'John Doe 2024'                 → REJETÉ
```

---

## 🔧 Modification des tests

Pour ajouter un nouveau test:

```javascript
it('devrait accepter [description]', () => {
  const result = validateContactData({
    name: 'John Doe',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message'
  });
  expect(result.valid).toBe(true);
});
```

---

## 📝 Structure des résultats

Chaque test retourne:
```javascript
{
  valid: boolean,        // true ou false
  errors: string[]       // Array de messages d'erreur
}
```

Exemple:
```javascript
{
  valid: false,
  errors: [
    'Le nom ne peut pas contenir de chiffres',
    'Format d\'email invalide'
  ]
}
```

---

## ✅ Checklist de validation

Avant de déployer, vérifiez:

```
[ ] npm install (installe Vitest)
[ ] npm test (tous les tests passent ✅)
[ ] npm run test:coverage (couverture > 90%)
[ ] Aucun warning/erreur dans les logs
```

---

## 🐛 Dépannage

### ❌ Erreur: "Cannot find module vitest"
```bash
npm install
```

### ❌ Erreur: "validation.js not found"
Vérifiez que le chemin d'import est correct:
```javascript
import { validateContactData } from '../src/middleware/validation.js';
```

### ❌ Tests ne s'exécutent pas
```bash
# Relancer avec plus de logs
npm test -- --reporter=verbose
```

---

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Frontend Tests](../frontend/tests) (si applicables)
- [Validation Middleware](../src/middleware/validation.js)

---

**Dernière mise à jour:** 22 avril 2026
**Statut:** ✅ Tous les tests passent
