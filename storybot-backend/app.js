import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve video files from temp/outputs under /videos
app.use('/videos', express.static(path.join(__dirname, 'temp/outputs')));

// Serve audio files from temp/downloads under /audio
app.use('/audio', express.static(path.join(__dirname, 'temp/downloads')));

export default app;