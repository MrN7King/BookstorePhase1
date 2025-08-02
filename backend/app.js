// File: backend/app.js
// backend/app.js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import './cron/AccountCleanup.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import ebookProductRoutes from './routes/ebookProductRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
//to upload ebook to backblaze b2 bucket
import ebookUploadRoutes from './routes/ebookUploadRoutes.js';
import premiumProductRoutes from './routes/PremiumProductRoutes.js'; // Import premium product routes
import premiumCodeRoutes from './routes/premiumCodesRoutes.js';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(cookieParser());



app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});


// Routes

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/productEbook', ebookProductRoutes);// Route for ebook products
app.use('/api/ebook-upload', ebookUploadRoutes); // Route for ebook file upload to backblaze b2 bucket
app.use('/api/upload', uploadRoutes);// Route for thumbnail image upload
app.use('/api/premium', premiumProductRoutes); // Route for premium products
app.use('/api/premium/codes', premiumCodeRoutes); // Route for premium codes
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;