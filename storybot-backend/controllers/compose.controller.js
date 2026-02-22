import { generateVideo } from '../services/compose.service.js';

export const composeVideo = async (req, res) => {
  const { audioUrl, videoUrl, captionText, title, body, subreddit } = req.body; // Include additional fields for validation

  // Update validation: audioUrl is now optional
  if (!videoUrl || !captionText || !title || !body || !subreddit) {
    console.error('🔥 /api/compose-video: Missing required fields in request body (videoUrl, captionText, title, body, subreddit).', req.body); // Log missing fields
    return res.status(400).json({ error: 'Missing required fields.', received: req.body });
  }

  console.log('[🎬 Backend] Starting video composition');
  // Pass all received data to generateVideo, including the optional audioUrl
  try {
    const videoPath = await generateVideo({ audioUrl, videoUrl, captionText });
    console.log('[✅ Backend] Video composition successful. Output path:', videoPath);
    res.json({ videoPath });
  } catch (err) {
    console.error('🔥 Backend Video composition failed:', err);
    res.status(500).json({ error: 'Video composition failed.', detail: err.message });
  }
};
