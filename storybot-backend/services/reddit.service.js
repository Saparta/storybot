import snoowrap from 'snoowrap';
import { cleanText } from '../utils/cleaner.js';

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

export const getRedditPosts = async (subreddit, limit = 1) => {
  const submissions = await reddit.getSubreddit(subreddit).getTop({ time: 'day', limit });
  return submissions
    .filter(post => post.selftext.length > 100)
    .map(post => ({
      title: post.title,
      body: cleanText(post.selftext),
      url: post.url
    }));
};