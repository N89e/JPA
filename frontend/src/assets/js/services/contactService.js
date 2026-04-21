import { submitContact } from "../api/endpoints.js";

/**
 * Patterns dangereux couramment utilisés pour les attaques XSS
 */
const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<object[^>]*>/gi,
  /<img[^>]*\s(src|onerror)[^>]*>/gi,
  /eval\(/gi,
  /expression\(/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

/**
 * Vérifier si une chaîne contient des patterns malveillants
 */
function containsDangerousPatterns(str) {
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(str));
}

/**
 * Vérifier si une chaîne contient des chiffres
 */
function containsNumbers(str) {
  return /\d/.test(str);
}

/**
 * Vérifier si une chaîne contient des caractères spéciaux non autorisés
 * Caractères autorisés: lettres, espaces, tirets, apostrophes UNIQUEMENT
 */
function containsSpecialCharacters(str) {
  // Pattern qui détecte TOUS les caractères spéciaux non autorisés
  // Bloque: _!%/"~+?,;:@#$&(){}[]<>|\\^`~=
  const specialCharRegex = /[_!%/"~+?,;:@#$&(){}[\]<>|\\^`~=\[\]]/;
  return specialCharRegex.test(str);
}

/**
 * Vérifier si le nom et le sujet sont valides (lettres, espaces, tirets, apostrophes uniquement)
 */
function isValidNameOrSubject(text) {
  // Autorise uniquement: lettres (y compris accents), espaces, tirets et apostrophes
  const validRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return validRegex.test(text);
}

/**
 * Valider les données du formulaire côté client
 */
function validateFormData(formData) {
  const errors = [];

  // Vérifier que tous les champs existent et ne sont pas vides
  if (!formData.name || !formData.name.trim()) {
    errors.push('Le nom est requis');
  } else if (containsDangerousPatterns(formData.name)) {
    errors.push('Le nom contient des caractères non autorisés');
  } else if (containsNumbers(formData.name)) {
    errors.push('Le nom ne peut pas contenir de chiffres');
  } else if (containsSpecialCharacters(formData.name)) {
    errors.push('Le nom ne peut pas contenir de caractères spéciaux');
  } else if (!isValidNameOrSubject(formData.name)) {
    errors.push('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes');
  }
  
  if (!formData.email || !formData.email.trim()) {
    errors.push('L\'email est requis');
  } else if (!isValidEmail(formData.email)) {
    errors.push('L\'email est invalide');
  } else if (containsDangerousPatterns(formData.email)) {
    errors.push('L\'email contient des caractères non autorisés');
  }
  
  if (!formData.subject || !formData.subject.trim()) {
    errors.push('Le sujet est requis');
  } else if (containsDangerousPatterns(formData.subject)) {
    errors.push('Le sujet contient des caractères non autorisés');
  } else if (containsNumbers(formData.subject)) {
    errors.push('Le sujet ne peut pas contenir de chiffres');
  } else if (containsSpecialCharacters(formData.subject)) {
    errors.push('Le sujet ne peut pas contenir de caractères spéciaux');
  } else if (!isValidNameOrSubject(formData.subject)) {
    errors.push('Le sujet ne peut contenir que des lettres, espaces, tirets et apostrophes');
  }
  
  if (!formData.message || !formData.message.trim()) {
    errors.push('Le message est requis');
  } else if (containsDangerousPatterns(formData.message)) {
    errors.push('Le message contient des caractères non autorisés');
  }

  // Vérifier les longueurs
  if (formData.name.length > 100) {
    errors.push('Le nom ne doit pas dépasser 100 caractères');
  }

  if (formData.subject.length > 200) {
    errors.push('Le sujet ne doit pas dépasser 200 caractères');
  }

  if (formData.message.length > 5000) {
    errors.push('Le message ne doit pas dépasser 5000 caractères');
  }

  return errors;
}

/**
 * Vérifier si l'email est valide
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Afficher le message à l'utilisateur
 */
function showMessage(formMessage, message, isSuccess = true) {
  formMessage.textContent = message;
  
  if (isSuccess) {
    formMessage.classList.remove('error', 'warning');
    formMessage.classList.add('success');
  } else {
    formMessage.classList.remove('success', 'warning');
    formMessage.classList.add('error');
  }

  formMessage.style.display = 'block';
}

/**
 * Soumettre le formulaire de contact
 */
function setupContactFormListener() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const formMessage = document.getElementById("formMessage");
  let isSubmitting = false; // Empêcher les soumissions multiples

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Empêcher les soumissions multiples
    if (isSubmitting) return;
    isSubmitting = true;

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    // Valider côté client
    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      showMessage(
        formMessage, 
        validationErrors[0], 
        false
      );
      isSubmitting = false;
      return;
    }

    try {
      // Afficher un message de chargement
      showMessage(formMessage, '⏳ Envoi de votre demande...', true);
      
      const response = await submitContact(formData);

      if (response.success) {
        showMessage(
          formMessage,
          '✅ ' + response.message,
          true
        );
        
        // Réinitialiser le formulaire
        contactForm.reset();

        // Masquer le message après 8 secondes
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 8000);
      } else {
        throw new Error(response.message || 'Une erreur est survenue');
      }
    } catch (error) {
      const errorMessage = error.message || "Erreur lors de l'envoi du message";
      showMessage(
        formMessage,
        '❌ ' + errorMessage,
        false
      );

      // Masquer le message d'erreur après 6 secondes
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 6000);
    } finally {
      isSubmitting = false;
    }
  });

  // Afficher le compteur de caractères pour le message
  const messageInput = document.getElementById("message");
  if (messageInput) {
    const maxLength = 5000;
    const charCounter = document.createElement('small');
    charCounter.id = 'charCounter';
    charCounter.style.display = 'block';
    charCounter.style.marginTop = '5px';
    charCounter.style.color = '#666';
    messageInput.parentElement.appendChild(charCounter);

    messageInput.addEventListener('input', () => {
      const current = messageInput.value.length;
      charCounter.textContent = `${current}/${maxLength} caractères`;
      
      if (current > maxLength * 0.9) {
        charCounter.style.color = '#ff6b6b';
      } else {
        charCounter.style.color = '#666';
      }
    });

    // Initialiser le compteur
    charCounter.textContent = `0/${maxLength} caractères`;
  }
}

/**
 * Initialiser le formulaire de contact - appelé après le chargement de la section
 */
export function initContactForm() {
  // Écouter l'événement de chargement de la section contact
  document.addEventListener('section-loaded', (event) => {
    if (event.detail.sectionId === 'contact') {
      setupContactFormListener();
    }
  });

  // Au cas où la section contact serait déjà chargée (cas rare)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    setupContactFormListener();
  }
}
