import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEO_FOLDER = path.join(__dirname, '../temp/outputs');

export const getVideo = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(VIDEO_FOLDER, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.sendFile(filePath);
};