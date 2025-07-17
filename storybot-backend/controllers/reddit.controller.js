import { getRedditPosts } from '../services/reddit.service.js';

export const fetchPosts = async (req, res) => {
  const { subreddit = 'pettyrevenge', limit = 1 } = req.query;
  try {
    const posts = await getRedditPosts(subreddit, limit);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};