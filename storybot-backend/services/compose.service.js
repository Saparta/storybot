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
  const audioPath = path.join(TMP_DIR, 'downloads', `${id}.mp3`);
  const videoPath = path.join(TMP_DIR, 'downloads', `${id}.mp4`);
  const outputPath = path.join(TMP_DIR, 'outputs', `final_${id}.mp4`);

  // Download audio
  const audioRes = await fetch(audioUrl);
  const audioBuffer = await audioRes.buffer();
  fs.writeFileSync(audioPath, audioBuffer);

  // Download video
  const videoStream = ytdl(videoUrl, { quality: 'highest' });
  const videoWriteStream = fs.createWriteStream(videoPath);
  await new Promise((resolve, reject) => {
    videoStream.pipe(videoWriteStream);
    videoStream.on('end', resolve);
    videoStream.on('error', reject);
  });

  // Merge with caption using FFmpeg
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .complexFilter([
        {
          filter: 'drawtext',
          options: {
            fontfile: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            text: captionText.replace(/:/g, '\:'),
            fontsize: 24,
            fontcolor: 'white',
            box: 1,
            boxcolor: 'black@0.6',
            boxborderw: 5,
            x: '(w-text_w)/2',
            y: 'h-(text_h*2)'
          }
        }
      ])
      .outputOptions('-shortest')
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
};