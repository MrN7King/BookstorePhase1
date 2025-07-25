import multer from 'multer';

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/epub+zip',
    'application/x-mobipocket-ebook' // MOBI
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, EPUB, MOBI are allowed'), false);
  }
};

export const ebookUpload = multer({
  storage: multer.memoryStorage(), // Consistent memory storage
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter
});