import express from 'express';
import { fetchPosts, checkSubreddit, suggestSubreddits, fetchRandomStory } from '../controllers/reddit.controller.js';
import { textToSpeech } from '../controllers/tts.controller.js';
import { searchYouTube } from '../controllers/youtube.controller.js'; // Keep for now, but might remove later
import { composeVideo } from '../controllers/compose.controller.js';
import { getVideo } from '../controllers/video.controller.js';
import { getTopYouTubeVideo } from '../services/youtube.service.js'; // Import the service function directly

const router = express.Router();

router.get('/fetch-posts', fetchPosts);
router.post('/text-to-speech', textToSpeech);
// router.post('/search-video', searchYouTube); // Temporarily comment out or remove this route
router.post('/compose-video', composeVideo);
router.get('/check-subreddit', checkSubreddit);
router.get('/suggest-subreddits', suggestSubreddits);
router.get('/fetch-random-story', fetchRandomStory);

// New route to fetch a random YouTube video using the service logic
router.get('/fetch-youtube-video', async (req, res) => {
  try {
    const videoUrl = await getTopYouTubeVideo(); // Call the service function directly
    res.json({ videoUrl });
  } catch (err) {
    console.error('🔥 /api/fetch-youtube-video failed:', err);
    res.status(500).json({ error: 'Failed to fetch YouTube video.', detail: err.message });
  }
});

export default router;
router.get('/get-video/:filename', getVideo);