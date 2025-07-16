import argparse
from scrape import get_reddit_posts, save_posts

def run_storybot(subreddit: str, limit: int):
    print(f"📥 Fetching {limit} post(s) from r/{subreddit}...")
    posts = get_reddit_posts(subreddit=subreddit, limit=limit)
    if not posts:
        print("❌ No valid posts found.")
        return
    save_posts(posts)
    print("✅ Posts saved. Continue pipeline (TTS, video, etc).")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Storybot - Reddit Video Generator")
    parser.add_argument("--subreddit", type=str, default="pettyrevenge")
    parser.add_argument("--limit", type=int, default=1)
    args = parser.parse_args()
    run_storybot(subreddit=args.subreddit, limit=args.limit)
