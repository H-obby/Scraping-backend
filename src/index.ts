import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import exampleRoutes from './routes/exampleRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Your frontend origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', exampleRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Express + TypeScript Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
