import { generateTTS } from '../services/tts.service.js';
import path from 'path';

export const textToSpeech = async (req, res) => {
  const { text } = req.body;

  // Add type checking and validation for text input
  if (typeof text !== 'string' || text.trim() === '') {
    console.error('🔥 /api/text-to-speech: Invalid or empty text input.', { received: text }); // Log received input
    return res.status(400).json({
      error: 'TTS failed',
      detail: 'Text input must be a non-empty string.'
    });
  }

  console.log('[🗣 Backend] Starting text-to-speech generation');
  console.log('[DEBUG Backend] Incoming TTS text:', text.substring(0, 100) + (text.length > 100 ? '...' : '')); // Log truncated text

  try {
    const audioFilePath = await generateTTS(text); // generateTTS now returns file path

    // Construct the public URL for the audio file
    const audioFileName = path.basename(audioFilePath);
    const audioUrl = `/audio/${audioFileName}`;

    console.log('[✅ Backend] TTS successful. Audio URL:', audioUrl);
    res.json({ audioUrl });
  } catch (err) {
    console.error('🔥 Backend TTS failed:', err);
    res.status(500).json({ error: 'TTS failed', detail: err.message });
  }
};
