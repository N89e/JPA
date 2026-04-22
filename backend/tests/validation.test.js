import { describe, it, expect } from 'vitest';
import { validateContactData, sanitizeContactData } from '../src/middleware/validation.js';

describe('Validation Middleware', () => {
  
  // ========================================
  // Tests pour champs manquants
  // ========================================
  describe('Champs manquants', () => {
    it('devrait rejeter si name est manquant', () => {
      const result = validateContactData({
        name: '',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('devrait rejeter si email est manquant', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: '',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });

    it('devrait rejeter si subject est manquant', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: '',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });

    it('devrait rejeter si message est manquant', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: ''
      });
      expect(result.valid).toBe(false);
    });
  });

  // ========================================
  // Tests pour longueurs
  // ========================================
  describe('Longueurs des champs', () => {
    it('devrait rejeter si name dépasse 100 caractères', () => {
      const result = validateContactData({
        name: 'a'.repeat(101),
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('nom');
    });

    it('devrait accepter si name = 100 caractères', () => {
      const result = validateContactData({
        name: 'a'.repeat(100),
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });

    it('devrait rejeter si subject dépasse 200 caractères', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'a'.repeat(201),
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });

    it('devrait rejeter si message dépasse 5000 caractères', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'a'.repeat(5001)
      });
      expect(result.valid).toBe(false);
    });
  });

  // ========================================
  // Tests pour format email
  // ========================================
  describe('Format email', () => {
    it('devrait accepter email valide', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });

    it('devrait rejeter email sans @', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'john.doe.example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });

    it('devrait rejeter email sans domaine', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'john@',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });

    it('devrait rejeter email avec espaces', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'john doe@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });
  });

  // ========================================
  // Tests pour caractères spéciaux dangereux
  // ========================================
  describe('Caractères spéciaux dangereux (XSS/Injection)', () => {
    it('devrait rejeter si name contient <script>', () => {
      const result = validateContactData({
        name: 'John<script>alert("xss")</script>',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('patterns non autorisés');
    });

    it('devrait rejeter si message contient javascript:', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Click here javascript:alert("xss")'
      });
      expect(result.valid).toBe(false);
    });

    it('devrait rejeter si email contient encoded script (%3Cscript)', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test%3Cscript%3E@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });

    it('devrait rejeter si message contient iframe', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: '<iframe src="evil.com"></iframe>'
      });
      expect(result.valid).toBe(false);
    });
  });

  // ========================================
  // Tests pour caractères autorisés
  // ========================================
  describe('Caractères autorisés', () => {
    it('devrait accepter name avec accents', () => {
      const result = validateContactData({
        name: 'Jéan-Piérre D\'Amélie',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });

    it('devrait accepter name avec tirets', () => {
      const result = validateContactData({
        name: 'Jean-Pierre Dupont',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });

    it('devrait accepter name avec apostrophes', () => {
      const result = validateContactData({
        name: "D'Artagnan O'Brien",
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });

    it('devrait ACCEPTER subject avec chiffres (FIX #5)', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Agile 2024 Methodology',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });

    it('devrait ACCEPTER subject "Sprint 3 Démonstration"', () => {
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Sprint 3 Démonstration',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });

    it('devrait ACCEPTER subject "HTML5 & CSS3" (mais pas le & qui est spécial)', () => {
      // Note: Le & est bloqué pour la sécurité (prévention XSS)
      // Test avec version sans &
      const result = validateContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'HTML5 et CSS3',
        message: 'Test message'
      });
      expect(result.valid).toBe(true);
    });
  });

  // ========================================
  // Tests pour name avec chiffres (REJETÉ)
  // ========================================
  describe('Name avec chiffres (rejeté)', () => {
    it('devrait REJETER name avec chiffres', () => {
      const result = validateContactData({
        name: 'John Doe 2024',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('nom');
    });
  });

  // ========================================
  // Tests pour caractères de contrôle dangereux
  // ========================================
  describe('Caractères de contrôle dangereux', () => {
    it('devrait rejeter si name contient null byte', () => {
      const result = validateContactData({
        name: 'John\x00Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
      expect(result.valid).toBe(false);
    });
  });

  // ========================================
  // Tests cas valides complets
  // ========================================
  describe('Cas valides complets', () => {
    it('devrait accepter formulaire valide complet', () => {
      const result = validateContactData({
        name: 'Jean-Pierre Dupont',
        email: 'jean.pierre@example.com',
        subject: 'Sprint 3 Implementation Request',
        message: 'Je suis intéressé par vos services pour notre projet de 2024.'
      });
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('devrait accepter avec texte long valide', () => {
      const longMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50);
      const result = validateContactData({
        name: 'Marie-Antoinette',
        email: 'marie@example.com',
        subject: 'Web Development 2024',
        message: longMessage.substring(1, 5000)
      });
      expect(result.valid).toBe(true);
    });
  });

  // ========================================
  // Tests pour sanitization (nettoyage)
  // ========================================
  describe('Sanitization (nettoyage)', () => {
    it('devrait nettoyer les espaces inutiles', () => {
      const result = sanitizeContactData({
        name: '  John Doe  ',
        email: '  TEST@EXAMPLE.COM  ',
        subject: '  Test Subject  ',
        message: '  Test message  '
      });
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('test@example.com');
      expect(result.subject).toBe('Test Subject');
      expect(result.message).toBe('Test message');
    });

    it('devrait convertir email en minuscules', () => {
      const result = sanitizeContactData({
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        subject: 'Test',
        message: 'Test'
      });
      expect(result.email).toBe('john@example.com');
    });

    it('devrait encoder les caractères HTML pour prévenir XSS', () => {
      const result = sanitizeContactData({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: '<b>Bold</b> & "quoted"'
      });
      // DOMPurify should have sanitized this
      expect(result.message).not.toContain('<b>');
    });
  });
});
