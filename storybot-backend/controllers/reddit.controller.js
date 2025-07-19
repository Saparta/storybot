import { getRedditPosts } from '../services/reddit.service.js';
import fetch from 'node-fetch'; // Add this import if not already present

export const fetchPosts = async (req, res) => {
  const { subreddit = 'pettyrevenge', limit = 1 } = req.query;
  try {
    const posts = await getRedditPosts(subreddit, limit);
    res.json(posts);
  } catch (err) {
    console.error('Error in fetchPosts:', err); // <-- Add this line
    res.status(500).json({ error: err.message });
  }
};

export const checkSubreddit = async (req, res) => {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Subreddit name required.' });
  }

  try {
    const response = await fetch(`https://www.reddit.com/r/${name}/about.json`);
    if (!response.ok) {
      return res.status(404).json({ valid: false, message: 'Subreddit not found.' });
    }

    const json = await response.json();
    res.json({ valid: true, data: json.data });
  } catch (err) {
    res.status(500).json({ valid: false, error: 'Reddit lookup failed.' });
  }
};

export const suggestSubreddits = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json({ subreddits: [] });
  try {
    const response = await fetch(`https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${encodeURIComponent(query)}&limit=10`);
    const json = await response.json();
    const subreddits = (json.data?.children || []).map(child => child.data.display_name);
    res.json({ subreddits });
  } catch {
    res.json({ subreddits: [] });
  }
};