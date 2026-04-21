/**
 * SOLUTION: Fix Non-Portable Image Paths
 * 
 * PROBLEM (Current - backend/src/services/emailService.js):
 * ```javascript
 * const logoPath = path.join(
 *   __dirname,
 *   "../../../frontend/src/assets/images/Logo_Portfolio/Logo_Portfolio.png"
 * );
 * ```
 * 
 * Issues:
 * ❌ Breaks in Docker (different path)
 * ❌ Breaks if folder structure changes
 * ❌ Not portable across systems
 * ❌ Images not embedded, just paths
 * 
 * SOLUTIONS:
 */

// ================== SOLUTION 1: Use CDN/Backend URL (RECOMMENDED) ==================
/**
 * Instead of file paths, use URLs
 * 
 * This is the BEST approach for production
 */

// backend/src/services/emailService.js

// ✅ CORRECT - Use URLs instead of file paths
const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL || 
  'https://yourdomain.com/images/Logo_Portfolio.png';

const EMAIL_SIGNATURE_URL = process.env.EMAIL_SIGNATURE_URL ||
  'https://yourdomain.com/images/Nuno_ESTEVES-SIGNATURE.png';

// In email template:
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: userEmail,
  subject: 'Contact confirmation',
  html: `
    <div>
      <img src="${EMAIL_LOGO_URL}" alt="Logo" style="width: 200px;">
      <p>Hello!</p>
      <img src="${EMAIL_SIGNATURE_URL}" alt="Signature" style="width: 150px;">
    </div>
  `
};

// ================== SOLUTION 2: Embed Images as Base64 ==================
/**
 * Encode images in the email itself
 * Pros: Works offline, faster delivery
 * Cons: Larger emails, slower to update
 */

import fs from 'fs';
import path from 'path';

// Read and encode image
const logoBuffer = fs.readFileSync('./frontend/src/assets/images/Logo_Portfolio/Logo_Portfolio.png');
const logoBase64 = logoBuffer.toString('base64');

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: userEmail,
  subject: 'Contact confirmation',
  html: `
    <div>
      <img src="data:image/png;base64,${logoBase64}" alt="Logo">
    </div>
  `
};

// ================== SOLUTION 3: Use Environment Variables ==================
/**
 * Configure image URLs via environment variables
 */

// .env.production
// EMAIL_LOGO_URL=https://yourdomain.com/images/Logo_Portfolio.png
// EMAIL_SIGNATURE_URL=https://yourdomain.com/images/Nuno_ESTEVES-SIGNATURE.png

// backend/src/services/emailService.js
const logoUrl = process.env.EMAIL_LOGO_URL;
const signatureUrl = process.env.EMAIL_SIGNATURE_URL;

if (!logoUrl || !signatureUrl) {
  throw new Error('EMAIL_LOGO_URL and EMAIL_SIGNATURE_URL required in .env');
}

// ================== RECOMMENDED IMPLEMENTATION ==================
/**
 * Combine URL approach with fallback
 */

export const createEmailOptions = (userEmail, userName) => {
  const logoUrl = process.env.EMAIL_LOGO_URL || 'https://yourdomain.com/images/logo.png';
  const signatureUrl = process.env.EMAIL_SIGNATURE_URL || 'https://yourdomain.com/images/signature.png';

  return {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Votre demande de contact a été reçue',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h1>Demande Reçue</h1>
          <p>Bonjour ${userName},</p>
          <p>Votre demande a été prise en compte.</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <img src="${signatureUrl}" alt="Signature" style="width: 120px; height: auto;">
        </div>
      </div>
    `
  };
};

// ================== STEP-BY-STEP FIX ==================
/**
 * 1. Create images directory in frontend
 *    mkdir -p frontend/src/assets/images/email
 * 
 * 2. Serve images from backend or static server
 *    app.use('/images', express.static('./frontend/src/assets/images'));
 * 
 * 3. Add to .env.example
 *    EMAIL_LOGO_URL=http://localhost:5000/images/Logo_Portfolio.png
 *    EMAIL_SIGNATURE_URL=http://localhost:5000/images/Nuno_ESTEVES-SIGNATURE.png
 * 
 * 4. Add to .env.production
 *    EMAIL_LOGO_URL=https://yourdomain.com/images/Logo_Portfolio.png
 *    EMAIL_SIGNATURE_URL=https://yourdomain.com/images/Nuno_ESTEVES-SIGNATURE.png
 * 
 * 5. Update backend/src/services/emailService.js
 *    - Remove path.join() logic
 *    - Use process.env.EMAIL_LOGO_URL
 * 
 * 6. Test locally:
 *    npm run dev
 *    Send test email to yourself
 *    Verify images load
 * 
 * 7. Deploy to production
 */

// ================== NGINX CONFIGURATION ==================
/**
 * Add to nginx.conf to serve images
 */

// location /images/ {
//   alias /usr/share/nginx/html/src/assets/images/;
//   expires 1y;
//   add_header Cache-Control "public, immutable";
// }

// ================== BACKEND SERVER CONFIGURATION ==================
/**
 * Alternative: Serve from backend
 */

// backend/src/server.js
// app.use('/images', express.static('./frontend/src/assets/images'));

// Then in .env:
// EMAIL_LOGO_URL=http://localhost:5000/images/Logo_Portfolio/Logo_Portfolio.png

// ================== DOCKER CONFIGURATION ==================
/**
 * In docker-compose.yml, mount images volume
 */

// services:
//   backend:
//     volumes:
//       - ./frontend/src/assets/images:/app/images:ro
//     environment:
//       - EMAIL_LOGO_URL=http://backend:5000/images/Logo_Portfolio.png

// Or use static file serving via Nginx
// nginx:
//   volumes:
//     - ./frontend/src/assets/images:/usr/share/nginx/html/images:ro
//   # Then access via http://localhost:3000/images/...

// ================== TESTING ==================
/**
 * Test email generation
 */

// node -e "
// import('./backend/src/services/emailService.js')
//   .then(async m => {
//     const options = m.createEmailOptions('test@example.com', 'Test User');
//     console.log(JSON.stringify(options, null, 2));
//   })
// "

export default {
  EMAIL_LOGO_URL: process.env.EMAIL_LOGO_URL || 'https://yourdomain.com/images/logo.png',
  EMAIL_SIGNATURE_URL: process.env.EMAIL_SIGNATURE_URL || 'https://yourdomain.com/images/signature.png',
};

/**
 * SUMMARY:
 * 
 * Problem: Hard-coded file paths not portable
 * 
 * Solution: Use URLs instead of file paths
 * 
 * Benefits:
 * ✅ Works in Docker
 * ✅ Works in cloud
 * ✅ Configurable per environment
 * ✅ Images can be on CDN
 * ✅ No file system dependencies
 * 
 * Implementation time: 15 minutes
 * Testing time: 5 minutes
 * Importance: 🔴 CRITICAL for cloud deployment
 */
