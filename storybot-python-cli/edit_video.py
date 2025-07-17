import os
import random
from datetime import datetime
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips

def get_random_clip(folder_path="/workspace/storybot/clips/") -> str:
    clips = [f for f in os.listdir(folder_path) if f.endswith(".mp4")]
    if not clips:
        raise FileNotFoundError("No video clips found in '/workspace/storybot/clips/' folder.")
    return os.path.join(folder_path, random.choice(clips))

def combine_audio_video(audio_path: str, video_path: str, out_path: str = None):
    if out_path is None:
        ts = datetime.now().strftime("%Y%m%d%H%M%S")
        out_path = f"/workspace/storybot/videos/story_{ts}.mp4"

    video = VideoFileClip(video_path)
    audio = AudioFileClip(audio_path)
    duration = audio.duration

    if video.duration < duration:
        loop_count = int(duration // video.duration) + 1
        clips = [video] * loop_count
        video = concatenate_videoclips(clips)
    
    final_video = video.subclip(0, duration).set_audio(audio)
    final_video.write_videofile(out_path, codec="libx264", audio_codec="aac")
    print(f"🎞️ Final video saved to {out_path}")
