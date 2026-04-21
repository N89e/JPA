// =====================
//   NAVBAR MOBILE
// =====================

/**
 * Initialise la navbar et tous ses événements
 */
export function initNavbar() {
  
  const menuIcon = document.querySelector('.menu-icon');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuIcon || !navbarMenu) {
    return;
  }

  // ── Toggle menu burger ──────────────────────────────────────
  menuIcon.addEventListener('click', () => {

    if (menuIcon.classList.contains('active')) {
      menuIcon.classList.remove('active');
      navbarMenu.classList.remove('active');
    } else {
      menuIcon.classList.add('active');
      navbarMenu.classList.add('active');
    }
  });

  // ── Fermer le menu quand on clique sur un lien ──────────────
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuIcon.classList.remove('active');
      navbarMenu.classList.remove('active');
      
      // Ajouter la classe active au lien cliqué
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ── Réinitialiser au redimensionnement ──────────────────────
  // matchMedia se déclenche UNIQUEMENT au passage du breakpoint (plus performant que resize)
  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');

  const handleBreakpointChange = (e) => {
    if (!e.matches) {
      // On vient de passer en mode desktop → on remet tout à zéro
      menuIcon.classList.remove('active');
      navbarMenu.classList.remove('active');

      // Sécurité : supprime les styles inline si jamais il y en a
      navbarMenu.style.removeProperty('left');
      navbarMenu.style.removeProperty('display');
    }
  };

  // Écoute le changement de breakpoint
  mobileBreakpoint.addEventListener('change', handleBreakpointChange);

  // ── Mettre à jour le lien actif lors du scroll ──────────────
  window.addEventListener('scroll', () => {
    updateActiveLink();
  });

  // ── Smooth scroll pour les liens d'ancrage ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#app') {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ── Initialiser le lien actif ──────────────────────────────
  updateActiveLink();

}

// =====================
//   FONCTION UTILITAIRE
// =====================

// Fonction pour mettre à jour le lien actif lors du scroll
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = 'home'; // Défaut à "home" au chargement
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    // Ignorer les sections vides (hauteur 0)
    if (sectionHeight > 0 && pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
}

/**
 * Initialise les animations des cartes lors du scroll (Intersection Observer)
 */
export function initCardAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease-out';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observer les cartes pour l'animation d'entrée
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    observer.observe(card);
  });
}
