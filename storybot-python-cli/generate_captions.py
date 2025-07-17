import sys
print("sys.path:", sys.path)
from moviepy.editor import TextClip, CompositeVideoClip, VideoFileClip
from datetime import datetime

def add_static_caption(video_path: str, caption_text: str, out_path: str = None):
    ts = datetime.now().strftime("%Y%m%d%H%M%S")
    out_path = out_path or f"/workspace/storybot/videos/story_{ts}_captioned.mp4"

    video = VideoFileClip(video_path)
    txt_clip = TextClip(caption_text, fontsize=32, color='white', font='Arial-Bold',
                        size=(video.w * 0.9, None), method='caption')
    txt_clip = txt_clip.set_duration(video.duration).set_position(("center", "bottom")).margin(bottom=30)

    final = CompositeVideoClip([video, txt_clip])
    final.write_videofile(out_path, codec="libx264", audio_codec="aac")
    print(f"🔤 Captioned video saved to {out_path}")
