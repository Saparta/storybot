import googleTTS from 'google-tts-api';

export const generateTTS = async (text) => {
  const url = googleTTS.getAudioUrl(text, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  });

  return url; // return the public MP3 URL
};