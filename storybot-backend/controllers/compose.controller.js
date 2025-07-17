import { generateVideo } from '../services/compose.service.js';

export const composeVideo = async (req, res) => {
  const { audioUrl, videoUrl, captionText } = req.body;

  if (!audioUrl || !videoUrl || !captionText) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const videoPath = await generateVideo({ audioUrl, videoUrl, captionText });
    res.json({ videoPath });
  } catch (err) {
    res.status(500).json({ error: 'Video composition failed.', detail: err.message });
  }
};