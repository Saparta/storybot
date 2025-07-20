import { getRedditPosts } from '../services/reddit.service.js';
import fetch from 'node-fetch';
import snoowrap from 'snoowrap';
import dotenv from 'dotenv';
import { cleanText } from '../utils/cleaner.js';

dotenv.config();

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

// Test Reddit API authentication after initialization
reddit.getMe()
  .then(user => console.log('Authenticated Reddit user:', user.name))
  .catch(err => {
    console.error('🔥 Snoowrap failed auth:', err.statusCode, err.message);
  });

const preferredSubreddits = [
  "pettyrevenge", "AITA", "TIFU", "offmychest", "confessions", "relationships", "trueoffmychest", "askreddit", "nosleep", "PublicFreakout", "AmItheCloaca"
];

const fallbackSubreddits = [
  "pettyrevenge", "AITA", "TIFU", "offmychest", "confessions", "relationships", "trueoffmychest", "askreddit", "nosleep", " historiasdereddit"
];

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
      const errorText = await response.text();
      console.error(`Error checking subreddit ${name}: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ valid: false, message: `Subreddit not found or accessible. Status: ${response.status}` });
    }

    const json = await response.json();
    res.json({ valid: true, data: json.data });
  } catch (err) {
    console.error('Error during Reddit lookup:', err);
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

export const fetchRandomStory = async (req, res) => {
  let selectedSubredditName;
  let attempts = 0;
  const maxAttempts = 5; // Limit attempts to find a suitable story

  while (attempts < maxAttempts) {
    attempts++;
    try {
      // 1. Prioritize curated subreddits for the first few attempts
      if (attempts <= 3) { // Attempt to pick from preferred subreddits for the first 3 tries
        selectedSubredditName = preferredSubreddits[Math.floor(Math.random() * preferredSubreddits.length)];
      } else {
        // 2. After initial attempts, try popular subreddits
        const popularSubreddits = await reddit.getPopularSubreddits({ limit: 50 });
        const subredditList = popularSubreddits.map(sub => sub.display_name);

        const availableSubreddits = subredditList.length > 0 ? subredditList : fallbackSubreddits; // Use fallback if popular list is empty

        selectedSubredditName = availableSubreddits[Math.floor(Math.random() * availableSubreddits.length)];
      }

      // 3. Fetch top posts from the selected subreddit
      const submissions = await reddit.getSubreddit(selectedSubredditName).getTop({
        time: 'day',
        limit: 10, // Fetch more posts to increase chances of finding a good one
      });

      // 4. Filter out empty/selftext-less posts and find the first good one
      const foundStory = submissions.find(post => post.selftext && post.selftext.length > 200); // Increased minimum length for more substantial stories

      if (foundStory) {
        // 5. Return the story details if a suitable post is found
        return res.json({
          title: foundStory.title,
          body: cleanText(foundStory.selftext),
          url: foundStory.url,
          subreddit: selectedSubredditName
        });
      }
    } catch (err) {
      console.error(`[fetchRandomStory ERROR] Attempt ${attempts} failed for r/${selectedSubredditName || 'N/A'}:`, err);
      // Continue to the next attempt if an error occurs
    }
  }

  // If no suitable story is found after max attempts
  res.status(404).json({ message: 'Could not find a suitable story after multiple attempts.' });
};
