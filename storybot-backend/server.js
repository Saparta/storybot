import app from './app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // If using ES modules

    // If using ES modules (__dirname is not available by default)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    dotenv.config({ path: path.resolve(__dirname, '../.env') });
        

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Storybot backend running on http://localhost:${PORT}`);
});