import { getTopYouTubeVideo } from '../services/youtube.service.js';

export const searchYouTube = async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required.' });
  }

  try {
    const videoUrl = await getTopYouTubeVideo(query);
    res.json({ videoUrl });
  } catch (err) {
    res.status(500).json({ error: 'YouTube search failed', detail: err.message });
  }
};