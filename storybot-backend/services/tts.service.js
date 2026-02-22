import googleTTS from 'google-tts-api';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TMP_DIR = path.join(__dirname, '../temp');

const ensureTempFolders = () => {
  ['audio_chunks', 'downloads', 'outputs'].forEach(folder => // Added audio_chunks
    fs.mkdirSync(path.join(TMP_DIR, folder), { recursive: true })
  );
};

export const generateTTS = async (text) => {
  ensureTempFolders(); // Ensure temp folders exist

  const options = {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  };

  if (text.length > 200) {
    // Use getAllAudioUrls for longer text
    const urls = googleTTS.getAllAudioUrls(text, options);
    
    // Download and merge audio chunks
    const audioPaths = [];
    const id = uuidv4();
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const chunkPath = path.join(TMP_DIR, 'audio_chunks', `${id}_${i}.mp3`);
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFileSync(chunkPath, buffer);
      audioPaths.push(chunkPath);
    }

    const outputPath = path.join(TMP_DIR, 'downloads', `${id}_merged.mp3`);

    return new Promise((resolve, reject) => {
      let ffmpegCommand = ffmpeg();
      audioPaths.forEach(audioPath => {
        ffmpegCommand = ffmpegCommand.input(audioPath);
      });

      ffmpegCommand
        .mergeToFile(outputPath, TMP_DIR) // Merge chunks
        .on('end', () => {
          // Clean up individual audio chunks
          audioPaths.forEach(audioPath => fs.unlinkSync(audioPath));
          resolve(outputPath); // Return the path to the merged audio file
        })
        .on('error', (err) => {
          console.error('FFmpeg merging error:', err);
           // Clean up individual audio chunks even on error
          audioPaths.forEach(audioPath => fs.unlinkSync(audioPath));
          reject(err);
        });
    });


  } else {
    // Use getAudioUrl for shorter text
    const url = googleTTS.getAudioUrl(text, options);
    // For short text, we still need to download and save it to a file
    // to keep the generateVideo function's input consistent.
    const id = uuidv4();
    const outputPath = path.join(TMP_DIR, 'downloads', `${id}.mp3`);
     const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(outputPath, buffer);
     return outputPath; // Return the path to the downloaded audio file
  }
};
