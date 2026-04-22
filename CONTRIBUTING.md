# 🤝 Guide de Contribution - Portfolio

**Merci de vouloir contribuer au projet Portfolio!**

---

## 📋 Processus de Contribution

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR-USERNAME/portfolio.git
cd portfolio
```

### 2. Créer une Branche
```bash
git checkout -b fix/nom-du-bug
```

### 3. Installer les Dépendances
```bash
npm run install-all
```

### 4. Développer & Tester
```bash
npm run dev
cd backend && npm test
```

### 5. Commit
```bash
git commit -m "feat: description du changement"
```

Préfixes: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`

### 6. Push & Pull Request
```bash
git push origin fix/nom-du-bug
```

---

## 🎯 Standards de Code

### Backend (Node.js)
- ✅ ES6 modules
- ✅ Validation d'inputs
- ✅ Tests Vitest
- ✅ Rate limiting

### Frontend (HTML/CSS/JS)
- ✅ HTML5 sémantique
- ✅ CSS responsive
- ✅ JavaScript vanilla
- ✅ WCAG 2.1 Level A+

---

## 🧪 Checklist Avant Soumission

- [ ] Tests passent
- [ ] Pas d'erreurs console
- [ ] Responsive design
- [ ] Accessibilité OK
- [ ] Docs mises à jour
- [ ] Pas de secrets commités

---

**Merci pour votre contribution! 🚀**

Ressources: [README](./README.md) | [Audit](./AUDIT_W3C_SEO_ACCESSIBILITY.md) | [Backend](./backend/README.md)
