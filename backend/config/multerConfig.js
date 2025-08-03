//backend/config/multerConfig.js
import multer from 'multer';
import path from 'path';

// Disk storage for Cloudinary thumbnails
const thumbnailUpload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    cb(null, types.includes(file.mimetype));
  }
});

// Memory storage for B2 ebook uploads
const ebookUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook'];
    cb(null, types.includes(file.mimetype));
  }
});

// Use memory storage for both files
const uploadBothFiles = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 52 * 1024 * 1024 // 50MB overall limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      // Thumbnail validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid thumbnail type'), false);
      }
      if (file.size > 2 * 1024 * 1024) {
        return cb(new Error('Thumbnail too large (max 2MB)'), false);
      }
    } 
    else if (file.fieldname === 'ebook') {
      // Ebook validation
      const allowedTypes = ['application/pdf', 'application/epub+zip'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid ebook type'), false);
      }
    }
    cb(null, true);
  }
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'ebook', maxCount: 1 }
]);


// multerConfig.js for  premium Thumbnail Upload
const premiumThumbnailUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid thumbnail type. Only JPEG, PNG, and WebP are allowed'), false);
    }
  }
}).single('thumbnail'); // 'thumbnail' matches the field name in your form

export { thumbnailUpload, ebookUpload, uploadBothFiles, premiumThumbnailUpload };