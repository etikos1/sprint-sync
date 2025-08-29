// src/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config'; // Load .env variables

import swaggerDocs from './config/swagger.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import aiRoutes from './routes/ai.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// ===== API DOCUMENTATION =====
swaggerDocs(app);

/*app.get('/api/health', (req, res) => {
 res.json({ message: 'Server is alive and healthy! 🟢' });
});*/

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});