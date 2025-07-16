from gtts import gTTS
import os

def text_to_speech(text: str, out_path: str):
    """
    Converts text to speech using gTTS and saves it to a file.
    """
    tts = gTTS(text=text, lang='en')
    tts.save(out_path)
