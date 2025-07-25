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
import userRoutes from './routes/userRoutes.js';



const app = express();

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials:true}));
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
app.use('/api/orders', orderRoutes);
app.use('/api/premium-credentials', premiumCredentialsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;