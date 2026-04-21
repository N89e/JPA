import { sendUserConfirmationEmail, sendContactRequestToOwner } from '../services/emailService.js';
import logger from '../utils/logger.js';

// Contrôleur pour gérer les soumissions de contact
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    logger.info('Nouvelle demande de contact reçue', {
      name,
      email,
      subject: subject.substring(0, 50),
      requestId: req.id,
    });

    // Les données ont déjà été validées et sanitisées par le middleware
    // Préparer les données pour l'envoi
    const contactData = {
      name,
      email,
      subject,
      message,
      timestamp: new Date()
    };

    // Envoyer l'email de confirmation à l'utilisateur ET l'email au propriétaire en parallèle
    const [userEmailSent, ownerEmailSent] = await Promise.all([
      sendUserConfirmationEmail(email, name),
      sendContactRequestToOwner(contactData)
    ]);

    // Vérifier que les emails ont été envoyés
    if (!userEmailSent || !ownerEmailSent) {
      logger.warn('L\'un des emails n\'a pas pu être envoyé', {
        email,
        userEmailSent,
        ownerEmailSent,
        requestId: req.id,
      });
      // On retourne quand même un succès car la demande a été reçue
      // L'administrateur sera notifié des erreurs d'email dans les logs
    }

    logger.info('Contact form submitted successfully', {
      email,
      emailsSent: { userEmail: userEmailSent, ownerEmail: ownerEmailSent },
      requestId: req.id,
    });

    res.json({
      success: true,
      message: 'Votre demande a été prise en compte et vous serez contacté très prochainement. Un email de confirmation a été envoyé à votre adresse.',
      data: { 
        name, 
        email, 
        subject,
        emailsSent: { userEmail: userEmailSent, ownerEmail: ownerEmailSent }
      }
    });

  } catch (error) {
    logger.error('Erreur lors du traitement de la demande de contact', {
      error: error.message,
      stack: error.stack,
      requestId: req.id,
    });
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer plus tard.',
      requestId: req.id,
    });
  }
};
