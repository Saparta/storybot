import argparse
import os
from datetime import datetime
from scrape import get_reddit_posts, save_posts
from tts import text_to_speech
from tts import text_to_speech
from edit_video import combine_audio_video
from generate_captions import add_static_caption

def run_storybot(subreddit: str, limit: int):
    print(f"📥 Fetching {limit} post(s) from r/{subreddit}...")
    posts = get_reddit_posts(subreddit=subreddit, limit=limit)
    if not posts:
        print("❌ No valid posts found.")
        return
    save_posts(posts)
    print("✅ Posts saved. Continue pipeline (TTS, video, etc).")

    # Process the first post
    post = posts[0]
    title = post.get("title", "Untitled")
    body = post.get("body", "")

    # 2. Generate speech
    audio_filename = f"audio/voice_{datetime.now().strftime('%Y%m%d%H%M%S')}.mp3"
    print(f"🗣️ Generating speech to {audio_filename}...")
    text_to_speech(body, audio_filename)
    print("✅ Speech generation complete.")

    # 3. Download background video (using placeholder URL)
 from download_clip import fetch_and_download_clip
    print("🔍 Searching for background video...")
    video_filepath = fetch_and_download_clip("funny fails video comp 9:16")
    if not video_filepath:
        print("❌ Failed to download video. Cannot proceed with video creation.")
        return    
    print("✅ Video download complete.")

    # 4. Combine audio and video
    combined_video_path = f"videos/story_{datetime.now().strftime('%Y%m%d%H%M%S')}.mp4"
    print(f"🎬 Combining audio and video to {combined_video_path}...")
    combine_audio_video(audio_filename, video_filepath, combined_video_path)
    print("✅ Video combination complete.")

    # 5. Add static caption (Optional)
    captioned_video_path = f"videos/story_{datetime.now().strftime('%Y%m%d%H%M%S')}_captioned.mp4"
    print(f"📝 Adding caption to {combined_video_path}...")
    add_static_caption(combined_video_path, title, captioned_video_path)
    print("✅ Captioning complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Storybot - Reddit Video Generator")
    parser.add_argument("--subreddit", type=str, default="pettyrevenge")
    parser.add_argument("--limit", type=int, default=1)
    # Add argument for YouTube URL if desired later
    # parser.add_argument("--youtube_url", type=str, required=True, help="YouTube URL for background video")
    args = parser.parse_args()

    run_storybot(subreddit=args.subreddit, limit=args.limit)