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
import premiumCredentialsRoutes from './routes/premiumCredentialsRoutes.js';
import productRoutes from './routes/productRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
//to upload ebook to backblaze b2 bucket
import ebookUploadRoutes from './routes/ebookUploadRoutes.js';


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
app.use('/api/products', productRoutes);
app.use('/api/products', productRoutes);// Route for ebook products
app.use('/api/ebook-upload', ebookUploadRoutes); // Route for ebook file upload to backblaze b2 bucket
app.use('/api/upload', uploadRoutes);// Route for thumbnail image upload
app.use('/api/orders', orderRoutes);
app.use('/api/premium-credentials', premiumCredentialsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;