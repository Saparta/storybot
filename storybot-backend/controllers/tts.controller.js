import { generateTTS } from '../services/tts.service.js';

export const textToSpeech = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text input is required.' });
  }

  try {
    const audioUrl = await generateTTS(text);
    res.json({ audioUrl });
  } catch (err) {
    res.status(500).json({ error: 'TTS failed', detail: err.message });
  }
};