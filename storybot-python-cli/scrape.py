import praw
import json
from datetime import datetime

# Fill in your Reddit API keys (create an app at https://www.reddit.com/prefs/apps)
reddit = praw.Reddit(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    user_agent="storybot by /u/yourusername"
)

def get_reddit_posts(subreddit: str, limit: int = 1) -> list[dict]:
    posts = []
    for post in reddit.subreddit(subreddit).top(limit=limit, time_filter="day"):
        if post.selftext and len(post.selftext) > 100:
            posts.append({
                "title": post.title,
                "body": post.selftext.strip(),
                "url": post.url
            })
    return posts

def save_posts(posts, folder="stories/"):
    ts = datetime.now().strftime("%Y%m%d%H%M%S")
    with open(f"{folder}post_{ts}.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    posts = get_reddit_posts("pettyrevenge", limit=1)
    save_posts(posts)
    print(f"Saved {len(posts)} story(ies).")
