import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TMP_DIR = path.join(__dirname, '../temp');

const ensureTempFolders = () => {
  ['downloads', 'outputs'].forEach(folder =>
    fs.mkdirSync(path.join(TMP_DIR, folder), { recursive: true })
  );
};

export const generateVideo = async ({ audioUrl, videoUrl, captionText }) => {
  ensureTempFolders();

  const id = uuidv4();
  const videoPath = path.join(TMP_DIR, 'downloads', `${id}.mp4`);
  const outputPath = path.join(TMP_DIR, 'outputs', `final_${id}.mp4`);
  let audioInput = null;
  let ffmpegCommand = ffmpeg();

  // Download video (always required)
  console.log('[🎬 Backend] Downloading video...', videoUrl);
  try {
    const videoStream = ytdl(videoUrl, { quality: 'highestvideo' }); // Specify highest video quality
    const videoWriteStream = fs.createWriteStream(videoPath);
    await new Promise((resolve, reject) => {
      videoStream.pipe(videoWriteStream);
      videoStream.on('end', () => {
        console.log('[✅ Backend] Video downloaded.');
        resolve();
      });
      videoStream.on('error', (err) => {
        console.error('[🔥 Backend] Video download failed:', err);
        reject(err);
      });
    });
    ffmpegCommand = ffmpegCommand.input(videoPath);
  } catch (err) {
    console.error('[🔥 Backend] Failed to download video:', err);
    throw new Error(`Failed to download video: ${err.message}`);
  }

  // Download audio (if audioUrl is provided and not a placeholder)
  if (audioUrl && audioUrl !== 'placeholder_audio_url') {
    const audioPath = path.join(TMP_DIR, 'downloads', `${id}.mp3`);
    console.log('[🎬 Backend] Downloading audio...', audioUrl);
    try {
      const audioRes = await fetch(audioUrl);
      if (!audioRes.ok) {
          throw new Error(`HTTP error! status: ${audioRes.status}`);
      }
      const audioBuffer = await audioRes.buffer();
      fs.writeFileSync(audioPath, audioBuffer);
      audioInput = audioPath;
      ffmpegCommand = ffmpegCommand.input(audioInput);
      console.log('[✅ Backend] Audio downloaded.');
    } catch (err) {
      console.error('[🔥 Backend] Audio download failed:', err);
      // Continue without audio if download fails
      audioInput = null; 
    }
  } else {
      console.log('[⏭️ Backend] Skipping audio download (no audioUrl or placeholder).');
  }

  // FFmpeg command setup
  return new Promise((resolve, reject) => {
    // Start building the FFmpeg command
    
    ffmpegCommand
      .videoCodec('libx264')
      .outputOptions('-shortest'); // Stop encoding when the shortest input stream ends

      // Add audio codec only if audio input is available
    if (audioInput) {
        ffmpegCommand = ffmpegCommand.audioCodec('aac');
    }
      
      // Add drawtext filter (modify or make conditional if needed)
      const complexFilters = [];
      if (captionText) {
         complexFilters.push({
            filter: 'drawtext',
            options: {
              fontfile: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
              text: captionText.replace(/:/g, '\:'), // Escape colons
              fontsize: 24,
              fontcolor: 'white',
              box: 1,
              boxcolor: 'black@0.6',
              boxborderw: 5,
              x: '(w-text_w)/2',
              y: 'h-(text_h*2)'
            }
          });
      }

      if (complexFilters.length > 0) {
          ffmpegCommand = ffmpegCommand.complexFilter(complexFilters);
      }

    ffmpegCommand
      .on('start', (commandLine) => {
          console.log('[🎬 Backend] FFmpeg command:', commandLine);
      })
      .on('end', () => {
        console.log('[✅ Backend] Video composition finished.');
        // Clean up downloaded files
        fs.unlink(videoPath, (err) => { if (err) console.error('Error deleting video file:', err); });
        if (audioInput) {
            fs.unlink(audioInput, (err) => { if (err) console.error('Error deleting audio file:', err); });
        }
        resolve(outputPath); // Resolve with the path to the output file
      })
      .on('error', (err, stdout, stderr) => {
        console.error('[🔥 Backend] FFmpeg error:', err.message);
        console.error('FFmpeg stdout:', stdout);
        console.error('FFmpeg stderr:', stderr);
         // Attempt to clean up downloaded files even on error
        fs.unlink(videoPath, (err) => { if (err) console.error('Error deleting video file:', err); });
         if (audioInput) {
            fs.unlink(audioInput, (err) => { if (err) console.error('Error deleting audio file:', err); });
        }
        reject(err);
      })
      .save(outputPath); // Save the output to the specified path
  });
};