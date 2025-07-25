import B2 from 'backblaze-b2';
import dotenv from 'dotenv';

dotenv.config();

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY
});

export const generateDownloadUrl = async (fileInfo) => {
  await b2.authorize();
  
  // Valid for 7 days (604800 seconds)
  const expiresIn = 604800;
  
  return b2.getDownloadUrl({
    bucketId: fileInfo.bucketId,
    fileName: fileInfo.fileName,
    responseHeaders: {
      'Content-Disposition': `attachment; filename="${fileInfo.fileName.split('/').pop()}"`
    },
    validDurationInSeconds: expiresIn
  });
};


// javascript:backend/routes/downloadRoutes.js
// import express from 'express';
// import { generateDownloadUrl } from '../utils/b2Utils.js';
// import Ebook from '../models/Ebook.js';

// const router = express.Router();

// router.get('/:ebookId', async (req, res) => {
//   try {
//     const ebook = await Ebook.findById(req.params.ebookId);
//     if (!ebook) return res.status(404).json({ error: 'Ebook not found' });
    
//     const downloadUrl = await generateDownloadUrl(ebook.fileInfo);
//     res.redirect(downloadUrl);
//   } catch (error) {
//     res.status(500).json({ error: 'Could not generate download link' });
//   }
// });

// export default router;