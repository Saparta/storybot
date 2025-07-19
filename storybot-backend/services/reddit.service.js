import snoowrap from 'snoowrap';
import dotenv from 'dotenv';
import { cleanText } from '../utils/cleaner.js';

dotenv.config();

// Debug logging for Reddit credentials
console.log('[REDDIT ENV CHECK]', {
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

export const getRedditPosts = async (subreddit, limit = 1) => {
  try {
    const submissions = await reddit.getSubreddit(subreddit).getTop({
      time: 'day',
      limit: Number(limit),}); // <-- ensures number

    return submissions
      .filter(post => post.selftext && post.selftext.length > 100)
      .map(post => ({
        title: post.title,
        body: cleanText(post.selftext),
        url: post.url
      }));
  } catch (err) {
    console.error('[getRedditPosts ERROR]', err);
    throw err;
  }
};