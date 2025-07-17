from pytube import YouTube
from youtubesearchpython import VideosSearch
import os
from datetime import datetime

FALLBACK_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" # trusted background fallback

def search_youtube_video(query="funny fails video comp 9:16") -> str:
    try:
        videos = VideosSearch(query, limit=1).result().get("result", [])
        return videos[0]["link"] if videos else None
    except Exception:
        return None

def download_youtube_video(url: str, out_folder: str = "clips/") -> str:
    try:
        yt = YouTube(url)
        stream = yt.streams.filter(file_extension="mp4", res="720p", progressive=True).first()
        if not stream:
            stream = yt.streams.filter(file_extension="mp4", progressive=True).order_by("resolution").desc().first()
        if not stream:
            raise Exception("❌ No stream found.")


        filename = f"{yt.title[:50].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.mp4"

        filepath = os.path.join(out_folder, filename)
        stream.download(output_path=out_folder, filename=filename)
        print(f"📥 Downloaded: {filename}")
        return filepath
    except Exception as e:
        print(f"❌ Error downloading video: {e}")
        return ""

def fetch_and_download_clip(query="funny fails video comp 9:16") -> str:
    url = search_youtube_video(query)
    if not url:
        url = FALLBACK_URL # Use fallback if search fails
    return download_youtube_video(url)