// postRoutes.js
const express = require('express');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// 1. TEMPLATE EJS DU CV (inline)
// ─────────────────────────────────────────────────────────────────────────────




// ─────────────────────────────────────────────────────────────────────────────
// 2. CONFIG GOOGLE DRIVE
// ─────────────────────────────────────────────────────────────────────────────
const auth = new google.auth.GoogleAuth({
  keyFile: "C:/teest_tradrly/meniproject.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

async function uploadFileToDrive(filePath, fileName) {
  const authClient = await auth.getClient();
  const drive = google.drive({ version: "v3", auth: authClient });

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: "application/pdf",
      parents: ["1hoyiqu8KlpuRBfeka3CQG88XJG9AW_So"],
    },
    media: {
      mimeType: "application/pdf",
      body: fs.createReadStream(filePath),
    },
  });

  // Rendre le fichier public en lecture
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: { role: "reader", type: "anyone" },
  });

  // Récupérer le lien de visualisation
  const result = await drive.files.get({
    fileId: response.data.id,
    fields: "webViewLink",
  });

  return result.data.webViewLink;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTE POST /generate-cv
// ─────────────────────────────────────────────────────────────────────────────
router.post('/generate-cv', async (req, res) => {
  try {
    const data = req.body;
    console.log('Données reçues pour le CVvvvvv :', data);
    // Vérifier que toutes les données nécessaires sont présentes
   const requiredFields = ['nom', 'prenom', 'telephone', 'email', 'adresse', 'linkedin', 'profil', 'competences', 'generales', 'langues'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ error: `Le champ ${field} est requis` });
      }
    }
    


    // Générer le HTML depuis le template EJS
    const templatePath = path.join(__dirname, '../template/cvTemplate.ejs');
const html = await ejs.renderFile(templatePath, data);


    // Démarrer Puppeteer et générer le PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Écrire le PDF dans un fichier temporaire
    const fileName = `${data.nom}_${data.prenom}_CV.pdf`.replace(/\s+/g, '_');
    const tempPath = path.join(__dirname, fileName);
    fs.writeFileSync(tempPath, pdfBuffer);

    // Upload vers Google Drive
    
    const driveLink = await uploadFileToDrive(tempPath, fileName);

    // Supprimer le fichier temporaire
    fs.unlinkSync(tempPath);

    // Répondre avec le lien Google Drive
    res.json({
      message: 'CV généré et uploadé avec succès',
      driveLink
    });

  } catch (err) {
    console.error('Erreur génération CV :', err);
    res.status(500).json({ error: 'Erreur lors de la génération du CV' });
  }
});

module.exports = router;
