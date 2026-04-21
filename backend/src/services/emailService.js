import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

// Use environment variables for image URLs (for cloud portability)
// In production, use the domain where frontend is hosted (OVH)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const LOGO_URL = process.env.EMAIL_LOGO_URL || `${FRONTEND_URL}/src/assets/images/Logo_Portfolio/Logo_Portfolio.png`;
const SIGNATURE_URL = process.env.EMAIL_SIGNATURE_URL || `${FRONTEND_URL}/src/assets/images/Logo_Signature_Nuno/Nuno_ESTEVES-SIGNATURE.png`;


// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Envoyer un email de confirmation à l'utilisateur
 */
export const sendUserConfirmationEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Votre demande de contact a été reçue - Portfolio Nuno ESTEVES",
      html: `
        <link href="https://fonts.googleapis.com/css2?family=Pattaya&display=swap" rel="stylesheet">
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: black; margin: 0;">Demande Reçue</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333;">
              Bonjour <strong>${userName}</strong>,
            </p>
            <p style="font-size: 14px; color: #555; line-height: 1.6;">
              Merci de nous avoir contacté !
            </p>
            <p style="font-size: 14px; color: #555; line-height: 1.6;">
              Votre demande a été prise en compte et vous serez contacté très prochainement. 
              Nous vous remercions de votre patience et de votre intérêt.
            </p>
            <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #666; font-size: 13px;">
                <strong>Délai de réponse estimé :</strong> 24-48 heures ouvrables
              </p>
            </div>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
              Cet email a été généré automatiquement. Veuillez ne pas y répondre.
            </p>

          </div>
        </div>
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #ddd; margin-top: 30px; display: flex; align-items: end; justify-content: center;">
              <img src="${LOGO_URL}" alt="Logo Portfolio" style="height: 80px; width: auto;">
              <img src="${SIGNATURE_URL}" alt="Nuno ESTEVES" style="height: 20px; width: auto; margin-left: 20px;">
            </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info("Email de confirmation envoyé", { userEmail });
    return true;
  } catch (error) {
    logger.error("Erreur lors de l'envoi de l'email de confirmation", {
      error: error.message,
      userEmail,
    });
    return false;
  }
};

/**
 * Envoyer la demande de contact à l'adresse du propriétaire
 */
export const sendContactRequestToOwner = async (contactData) => {
  try {
    const transporter = createTransporter();
    const { name, email, subject, message } = contactData;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `Nouvelle demande de contact: ${subject}`,
      html: `
        <link href="https://fonts.googleapis.com/css2?family=Pattaya&display=swap" rel="stylesheet">
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px 0; background-color: #f9f9f9;">
            <img src="${LOGO_URL}" alt="Logo Portfolio" style="height: 80px; width: auto; margin-bottom: 20px;">
          </div>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: black; margin: 0;">Nouvelle Demande de Contact</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Informations du Contact</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0; font-size: 14px;">
                <strong>👤 Nom:</strong> ${name}
              </p>
              <p style="margin: 10px 0; font-size: 14px;">
                <strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a>
              </p>
              <p style="margin: 10px 0; font-size: 14px;">
                <strong>📝 Sujet:</strong> ${subject}
              </p>
            </div>

            <h3 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #fff; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">
              ${message}
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #999;">
                <strong>Date de réception:</strong> ${new Date().toLocaleString(
                  "fr-FR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  },
                )}
              </p>
              <p style="font-size: 12px; color: #999;">
                <strong>IP du client:</strong> Voir logs du serveur pour plus de détails
              </p>
            </div>

            <div style="background-color: #fffbea; padding: 15px; border-left: 4px solid #ffc107; margin-top: 20px; border-radius: 4px;">
              <p style="margin: 0; color: #666; font-size: 13px;">
                <strong>⚠️ Action requise:</strong> Merci de répondre rapidement à cette demande.
              </p>
            </div>
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #ddd; margin-top: 30px;">
              <img src="${LOGO_URL}" alt="Logo Portfolio" style="height: 80px; width: auto;">
            </div>
          </div>
        </div>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    logger.info("Email de demande envoyé au propriétaire", {
      ownerEmail: process.env.OWNER_EMAIL,
      contactEmail: email,
    });
    return true;
  } catch (error) {
    logger.error("Erreur lors de l'envoi de l'email au propriétaire", {
      error: error.message,
      ownerEmail: process.env.OWNER_EMAIL,
    });
    return false;
  }
};

/**
 * Tester la configuration email
 */
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info("Configuration email valide et vérifiée");
    return true;
  } catch (error) {
    logger.error("Erreur de configuration email", {
      error: error.message,
    });
    return false;
  }
};
