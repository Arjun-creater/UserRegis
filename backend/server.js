import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();


// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);


app.use(express.static(path.join(__dirname, '../frontend/dist')));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
