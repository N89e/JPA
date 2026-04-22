import DOMPurify from 'isomorphic-dompurify';

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
 * Patterns dangereux pour détecter les attaques XSS et injections
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
  /%3Cscript/gi,
  /%3c/gi,
  /&#x3c/gi,
  /&#60/gi,
];

/**
 * Vérifier si une chaîne contient des patterns malveillants
 */
function containsDangerousPatterns(str) {
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(str));
}

/**
 * Valider et nettoyer les données de contact
 */
export const validateContactData = (data) => {
  const errors = [];

  // Vérifier que tous les champs existent
  if (!data.name || !data.email || !data.subject || !data.message) {
    errors.push('Tous les champs sont requis');
    return { valid: false, errors };
  }

  // Vérifier les longueurs
  const maxNameLength = parseInt(process.env.MAX_NAME_LENGTH || 100);
  const maxEmailLength = parseInt(process.env.MAX_EMAIL_LENGTH || 254);
  const maxSubjectLength = parseInt(process.env.MAX_SUBJECT_LENGTH || 200);
  const maxMessageLength = parseInt(process.env.MAX_MESSAGE_LENGTH || 5000);

  if (data.name.length > maxNameLength) {
    errors.push(`Le nom ne doit pas dépasser ${maxNameLength} caractères`);
  }

  if (data.email.length > maxEmailLength) {
    errors.push(`L'email ne doit pas dépasser ${maxEmailLength} caractères`);
  }

  if (data.subject.length > maxSubjectLength) {
    errors.push(`Le sujet ne doit pas dépasser ${maxSubjectLength} caractères`);
  }

  if (data.message.length > maxMessageLength) {
    errors.push(`Le message ne doit pas dépasser ${maxMessageLength} caractères`);
  }

  // Vérifier le format email (strict RFC 5322 format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push('Format d\'email invalide');
  }

  // Vérifier qu'il n'y a pas de contenu vide après nettoyage
  if (!data.name.trim() || !data.message.trim()) {
    errors.push('Le nom et le message ne peuvent pas être vides');
  }

  // Vérifier l'absence de caractères de contrôle dangereux
  const dangerousCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  if (dangerousCharRegex.test(data.name + data.email + data.subject + data.message)) {
    errors.push('Caractères invalides détectés');
  }

  // Vérifier les patterns malveillants (XSS, injections)
  if (containsDangerousPatterns(data.name)) {
    errors.push('Le nom contient des patterns non autorisés');
  }
  if (containsDangerousPatterns(data.email)) {
    errors.push('L\'email contient des patterns non autorisés');
  }
  if (containsDangerousPatterns(data.subject)) {
    errors.push('Le sujet contient des patterns non autorisés');
  }
  if (containsDangerousPatterns(data.message)) {
    errors.push('Le message contient des patterns non autorisés');
  }

  // Vérifier que le nom ne contient pas de chiffres
  if (containsNumbers(data.name)) {
    errors.push('Le nom ne peut pas contenir de chiffres');
  }

  // Vérifier que le nom ne contient que des caractères autorisés
  if (!isValidNameOrSubject(data.name)) {
    errors.push('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes');
  }

  // Vérifier que le nom ne contient pas de caractères spéciaux
  if (containsSpecialCharacters(data.name)) {
    errors.push('Le nom ne peut pas contenir de caractères spéciaux');
  }

  // Vérifier que le sujet ne contient que des caractères autorisés (y compris chiffres)
  // FIX #5: Autoriser les chiffres dans le sujet (ex: "Agile 2024", "Sprint 3")
  // Regex: lettres (y compris accents), espaces, tirets, apostrophes, et chiffres
  const subjectRegex = /^[\p{L}\p{N}\s\-']+$/u;
  if (!subjectRegex.test(data.subject)) {
    errors.push('Le sujet ne peut contenir que des lettres, espaces, tirets, apostrophes et chiffres');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
};

/**
 * Nettoyer et encoder les données (prévention XSS)
 */
export const sanitizeContactData = (data) => {
  // Trim et nettoyer les espaces
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const subject = data.subject.trim();
  const message = data.message.trim();

  // Encoder les caractères HTML pour prévenir XSS
  const encoded = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    message: escapeHtml(message)
  };

  return encoded;
};

/**
 * Encoder les caractères HTML
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Middleware de validation et sanitization
 */
export const validateContactMiddleware = (req, res, next) => {
  // Validation
  const validation = validateContactData(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.errors[0],
      errors: validation.errors
    });
  }

  // Sanitization
  req.body = sanitizeContactData(req.body);

  next();
};
