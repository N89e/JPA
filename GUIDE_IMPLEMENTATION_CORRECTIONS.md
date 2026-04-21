# 🛠️ GUIDE D'IMPLÉMENTATION DES CORRECTIONS

Ce guide contient les corrections prêtes à copier/coller pour résoudre tous les problèmes d'audit.

---

## 1. CORRIGER INDEX.HTML (Frontend)

### Étape 1: Remplacer le `<head>`

**Fichier:** `frontend/index.html`

Remplacer de:
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/src/assets/images/Logo_Portfolio/Logo_Portfolio.png" type="image/png" sizes="16x16">
  <title>Portfolio - Développeur Full Stack</title>
  <link rel="stylesheet" href="src/assets/css/style.css">
  <link rel="stylesheet" href="src/assets/css/responsive.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Pattaya&family=Playwrite+IE:wght@100..400&display=swap" rel="stylesheet">
  <meta name="keywords" content="portfolio, chef de projet, informatique, industrie, gestion de projets, réalisations, solutions créatives, besoins numériques, besoins industriels, compétences en gestion de projets, compétences en industrie, projets informatiques, projets industriels, expertise en gestion de projets, expertise en industrie">
  <meta name="author" content="Nuno ESTEVES">
  <meta property="og:site" content="Nuno ESTEVES" data-react-helmet="true">
  <meta property="og:type" content="website" data-react-helmet="true">
  <meta property="og:url" content="https://www.nunoesteves.com/" data-react-helmet="true">
  <meta property="og:title" content="Portfolio - Chef de Projet" data-react-helmet="true">
  <meta property="og:description" content="Découvrez le portfolio d'un chef de projet passionné par l'informatique et le monde de l'industrie, mettant en avant mes compétences en gestion de projets et en industrie. Explorez mes réalisations variées et des solutions créatives pour vos besoins numériques." data-react-helmet="true">
</head>
```

À (avec les corrections):
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Chef de projet IT avec 6 ans d'expérience en gestion de projets complexes et expertise en industrie. Agile Scrum, SAFe, leadership d'équipe. Portfolio de Nuno ESTEVES.">
  <meta name="keywords" content="chef de projet IT, gestion de projets agile scrum, expert en industrie, pilotage de projets complexes, expert SAFe, France">
  <meta name="author" content="Nuno ESTEVES">
  
  <!-- Canonical URL pour SEO -->
  <link rel="canonical" href="https://www.nunoesteves.com/">
  
  <!-- Favicon -->
  <link rel="icon" href="/src/assets/images/Logo_Portfolio/Logo_Portfolio.png" type="image/png" sizes="16x16">
  
  <title>Portfolio - Chef de Projet IT | Nuno ESTEVES</title>
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="src/assets/css/style.css">
  <link rel="stylesheet" href="src/assets/css/responsive.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Pattaya&family=Playwrite+IE:wght@100..400&display=swap" rel="stylesheet">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.nunoesteves.com/">
  <meta property="og:title" content="Portfolio - Chef de Projet IT | Nuno ESTEVES">
  <meta property="og:description" content="Chef de projet IT avec 6 ans d'expérience en gestion de projets complexes et expertise en industrie. Découvrez mon expertise Agile, SAFe et leadership d'équipe.">
  <meta property="og:site_name" content="Portfolio Nuno ESTEVES">
  <meta property="og:image" content="https://www.nunoesteves.com/src/assets/images/Logo_Portfolio/Logo_Portfolio.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Portfolio - Chef de Projet IT | Nuno ESTEVES">
  <meta name="twitter:description" content="Chef de projet IT avec 6 ans d'expérience. Expertise Agile, SAFe, leadership.">
  <meta name="twitter:image" content="https://www.nunoesteves.com/src/assets/images/Logo_Portfolio/Logo_Portfolio.png">
  
  <!-- Structured Data (JSON-LD) pour Rich Snippets Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nuno ESTEVES",
    "jobTitle": "Chef de Projet IT",
    "url": "https://www.nunoesteves.com",
    "sameAs": [
      "https://www.linkedin.com/in/nuno-esteves-b89792246/",
      "https://github.com/N89e"
    ],
    "image": "https://www.nunoesteves.com/src/assets/images/Logo_Portfolio/Logo_Portfolio.png",
    "description": "Chef de projet IT avec 6 ans d'expérience en gestion de projets complexes, expertise en industrie, Agile Scrum et SAFe",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+33-6-50-66-66-41",
      "contactType": "Professional"
    }
  }
  </script>
</head>
```

### Étape 2: Corriger le `<body>`

Remplacer de:
```html
<body>
  <!-- Navigation Bar -->
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <div class="logo">
          <a href="#home" aria-label="Logo de mon portfolio">
            <img src="/src/assets/images/Logo_Portfolio/Logo_Portfolio.png" alt="logo de mon portfolio" class="logo">
          </a>
        </div>

      </div>
      <div class="menu-icon" id="menuIcon">
        <span></span>
        <span></span>
        <span></span>
      </div>
```

À:
```html
<body>
  <!-- Skip Link pour accessibilité clavier -->
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  
  <!-- Navigation Bar -->
  <nav class="navbar" role="navigation" aria-label="Navigation principale">
    <div class="navbar-container">
      <div class="navbar-logo">
        <div class="logo">
          <a href="#home" aria-label="Logo du portfolio de Nuno ESTEVES - Accueil">
            <img src="/src/assets/images/Logo_Portfolio/Logo_Portfolio.png" alt="Logo portfolio" class="logo">
          </a>
        </div>

      </div>
      <button class="menu-icon" id="menuIcon" aria-label="Ouvrir le menu de navigation" aria-expanded="false" aria-controls="navbarMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
```

### Étape 3: Corriger les sections

Remplacer de:
```html
  <!-- Main Content -->
  <main id="app">
    <div class="lign-high"></div>
    <div class="lign-midle"></div>
    <div class="lign-low"></div>
    </div>
    <!-- Sections chargées dynamiquement -->
    <section id="home" data-section></section>
    <section id="about" data-section></section>
    <section id="services" data-section></section>
    <section id="projects" data-section></section>
    <section id="contact" data-section></section>
    <div id="footer" data-section></div>
  </main>
```

À:
```html
  <!-- Main Content -->
  <main id="main-content" class="app">
    <div class="lign-high" aria-hidden="true"></div>
    <div class="lign-midle" aria-hidden="true"></div>
    <div class="lign-low" aria-hidden="true"></div>
    
    <!-- Sections chargées dynamiquement -->
    <section id="home" data-section role="region" aria-label="Accueil"></section>
    <section id="about" data-section role="region" aria-label="À propos"></section>
    <section id="services" data-section role="region" aria-label="Services"></section>
    <section id="projects" data-section role="region" aria-label="Projets"></section>
    <section id="contact" data-section role="region" aria-label="Contact"></section>
    <footer id="footer" data-section></footer>
  </main>
```

---

## 2. AJOUTER LES STYLES D'ACCESSIBILITÉ

**Fichier:** `frontend/src/assets/css/style.css`

Ajouter à la fin du fichier CSS:

```css
/* =====================
   ACCESSIBILITÉ - FOCUS VISIBLE
   ===================== */

/* Skip link (caché par défaut) */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
}

/* Focus visible pour tous les éléments interactifs */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
.nav-link:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* Améliorer la visibilité du focus pour le menu burger */
.menu-icon:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* Rendre visible le focus sur les items de navigation */
.nav-item .nav-link:focus-visible {
  background-color: rgba(78, 120, 255, 0.1);
  border-radius: 4px;
}

/* Remover le focus outline par défaut pour souris (mais pas clavier) */
a:focus:not(:focus-visible),
button:focus:not(:focus-visible),
input:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 3. CORRIGER FOOTER.HTML

**Fichier:** `frontend/src/pages/footer/footer.html`

Remplacer de:
```html
<div class="footer-info">
  <div class="footer-container">
    <div class="social-links">
      <a href="https://github.com/N89e" target="_blank" aria-label="Mon compte gitHub"><i class="fab fa-github"></i></a>
    </div>
    <div class="social-links">
      <a href="https://www.linkedin.com/in/nuno-esteves-b89792246/" target="_blank" aria-label="Mon compte linkedIn"><i class="fab fa-linkedin"></i></a>
    </div>
```

À:
```html
<footer class="footer-info">
  <div class="footer-container">
    <div class="social-links">
      <a href="https://github.com/N89e" target="_blank" rel="noopener noreferrer" aria-label="Visitez mon compte GitHub (lien externe)">
        <i class="fab fa-github" aria-hidden="true"></i>
      </a>
    </div>
    <div class="social-links">
      <a href="https://www.linkedin.com/in/nuno-esteves-b89792246/" target="_blank" rel="noopener noreferrer" aria-label="Visitez mon profil LinkedIn (lien externe)">
        <i class="fab fa-linkedin" aria-hidden="true"></i>
      </a>
    </div>
```

Ajouter à la fin:
```html
  </div>
</footer>
```

---

## 4. CORRIGER CONTACT.HTML

**Fichier:** `frontend/src/pages/contact/contact.html`

Remplacer de:
```html
      <div class="form-group">
        <label for="name">Nom <span class="required">*</span></label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="Votre nom complet"
          maxlength="100"
          required>
        <small class="form-help">Maximum 100 caractères</small>
      </div>
      <div class="form-group">
        <label for="email">Email <span class="required">*</span></label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="votre.email@example.com"
          maxlength="254"
          required>
        <small class="form-help">Nous vous enverrons une confirmation</small>
      </div>
      <div class="form-group">
        <label for="subject">Sujet <span class="required">*</span></label>
        <input 
          type="text" 
          id="subject" 
          name="subject" 
          placeholder="Sujet de votre demande"
          maxlength="200"
          required>
        <small class="form-help">Maximum 200 caractères</small>
      </div>
      <div class="form-group">
        <label for="message">Message <span class="required">*</span></label>
        <textarea 
          id="message" 
          name="message" 
          rows="5" 
          placeholder="Décrivez votre demande en détail..."
          maxlength="5000"
          required></textarea>
        <small class="form-help">Maximum 5000 caractères</small>
      </div>
```

À:
```html
      <div class="form-group">
        <label for="name">Nom <span class="required" aria-label="requis">*</span></label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="Votre nom complet"
          maxlength="100"
          required
          aria-describedby="name-help">
        <small id="name-help" class="form-help">Maximum 100 caractères</small>
      </div>
      <div class="form-group">
        <label for="email">Email <span class="required" aria-label="requis">*</span></label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="votre.email@example.com"
          maxlength="254"
          required
          aria-describedby="email-help">
        <small id="email-help" class="form-help">Nous vous enverrons une confirmation</small>
      </div>
      <div class="form-group">
        <label for="subject">Sujet <span class="required" aria-label="requis">*</span></label>
        <input 
          type="text" 
          id="subject" 
          name="subject" 
          placeholder="Sujet de votre demande"
          maxlength="200"
          required
          aria-describedby="subject-help">
        <small id="subject-help" class="form-help">Maximum 200 caractères</small>
      </div>
      <div class="form-group">
        <label for="message">Message <span class="required" aria-label="requis">*</span></label>
        <textarea 
          id="message" 
          name="message" 
          rows="5" 
          placeholder="Décrivez votre demande en détail..."
          maxlength="5000"
          required
          aria-describedby="message-help"></textarea>
        <small id="message-help" class="form-help">Maximum 5000 caractères</small>
      </div>
```

---

## 5. CORRIGER ABOUTME.HTML

**Fichier:** `frontend/src/pages/aboutMe/aboutMe.html`

Remplacer tous les `alt` courts par des descriptions complètes:

Exemple:
```html
<!-- De: -->
<img src="src/assets/images/Icons_methodes/Icon_3p.png" alt="logo de la méthode de gestion de projet 3P" />

<!-- À: -->
<img src="src/assets/images/Icons_methodes/Icon_3p.png" 
     alt="Logo de la méthode 3P (People, Process, Product) pour la gestion de projets" />
```

Appliquer à toutes les images:
- Icon_Scrum.png
- Icon_Kanban.png
- Icon_SAFe.png
- Icon_Jira.png
- Icon_Trello.png
- Icon_MSProject.png

---

## 6. CRÉER SITEMAP.XML

**Fichier:** `public/sitemap.xml` (à créer)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.nunoesteves.com/</loc>
    <lastmod>2026-04-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.nunoesteves.com/#home</loc>
    <lastmod>2026-04-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.nunoesteves.com/#about</loc>
    <lastmod>2026-04-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.nunoesteves.com/#services</loc>
    <lastmod>2026-04-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.nunoesteves.com/#projects</loc>
    <lastmod>2026-04-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.nunoesteves.com/#contact</loc>
    <lastmod>2026-04-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 7. CRÉER ROBOTS.TXT

**Fichier:** `public/robots.txt` (à créer)

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /*.json$

Sitemap: https://www.nunoesteves.com/sitemap.xml
```

---

## 8. METTRE À JOUR JAVASCRIPT (ACCESSIBILITÉ CLAVIER)

**Fichier:** `frontend/src/assets/js/app.js`

Ajouter cette fonction pour gérer l'aria-expanded du menu:

```javascript
// Gestion du menu burger avec accessibilité
const menuIcon = document.getElementById('menuIcon');
const navbarMenu = document.getElementById('navbarMenu');

if (menuIcon && navbarMenu) {
  menuIcon.addEventListener('click', () => {
    const isExpanded = menuIcon.getAttribute('aria-expanded') === 'true';
    menuIcon.setAttribute('aria-expanded', !isExpanded);
    navbarMenu.classList.toggle('active');
  });

  // Fermer le menu au clic sur un lien
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuIcon.setAttribute('aria-expanded', 'false');
      navbarMenu.classList.remove('active');
    });
  });

  // Fermer le menu avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuIcon.getAttribute('aria-expanded') === 'true') {
      menuIcon.setAttribute('aria-expanded', 'false');
      navbarMenu.classList.remove('active');
    }
  });
}
```

---

## ✅ CHECKLIST D'IMPLÉMENTATION

- [ ] Index.html - Mettre à jour le `<head>`
- [ ] Index.html - Ajouter skip-link et corriger les sections
- [ ] Index.html - Corriger la fermeture `</div>` invalide
- [ ] Style.css - Ajouter styles d'accessibilité
- [ ] Footer.html - Corriger la structure et aria-labels
- [ ] Contact.html - Ajouter aria-describedby
- [ ] AboutMe.html - Améliorer les alt texts
- [ ] Créer sitemap.xml
- [ ] Créer robots.txt
- [ ] Mettre à jour app.js pour le menu burger
- [ ] Tester avec W3C Validator
- [ ] Tester avec WAVE Accessibility
- [ ] Tester avec PageSpeed Insights

---

## 🧪 VALIDATION APRÈS IMPLÉMENTATION

### Test W3C HTML
1. Aller à https://validator.w3.org/
2. Coller l'URL: https://www.nunoesteves.com
3. Vérifier qu'il n'y a pas d'erreurs

### Test Accessibilité WAVE
1. Aller à https://wave.webaim.org/
2. Entrer l'URL: https://www.nunoesteves.com
3. Vérifier que les erreurs d'accessibilité sont résolues

### Test SEO - Google PageSpeed
1. Aller à https://pagespeed.web.dev/
2. Analyser l'URL
3. Vérifier le score et les recommandations

### Test Lighthouse
1. Dans Chrome DevTools (F12)
2. Aller à l'onglet "Lighthouse"
3. Cliquer sur "Analyze page load"
4. Vérifier les scores pour Accessibility, SEO, Best Practices

---

**Guide créé le:** 21/04/2026
