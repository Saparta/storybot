import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes.js';
import path from 'path'; // Keep this import
import { fileURLToPath } from 'url'; // Keep this import

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/videos', express.static(path.join(__dirname, 'temp/outputs'))); // Added line

export default app;