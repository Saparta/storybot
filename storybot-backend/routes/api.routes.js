import express from 'express';
import { fetchPosts, checkSubreddit, suggestSubreddits } from '../controllers/reddit.controller.js';
import { textToSpeech } from '../controllers/tts.controller.js';

import { searchYouTube } from '../controllers/youtube.controller.js';
import { composeVideo } from '../controllers/compose.controller.js';
import { getVideo } from '../controllers/video.controller.js';

const router = express.Router();

router.get('/fetch-posts', fetchPosts);
router.post('/text-to-speech', textToSpeech);
router.post('/search-video', searchYouTube);
router.post('/compose-video', composeVideo);
router.get('/check-subreddit', checkSubreddit);
router.get('/suggest-subreddits', suggestSubreddits);

export default router;
router.get('/get-video/:filename', getVideo);