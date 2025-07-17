import { GetListByKeyword } from 'youtube-search-api';

const FALLBACK_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export const getTopYouTubeVideo = async (query) => {
  try {
    const result = await GetListByKeyword(query, false, 1);
    const videos = result.items.filter(item => item.type === 'video');

    if (videos.length === 0) {
      console.warn('No YouTube results found. Using fallback.');
      return FALLBACK_VIDEO_URL;
    }

    return `https://www.youtube.com/watch?v=${videos[0].id}`;
  } catch (err) {
    console.error('YouTube search failed. Using fallback.', err.message);
    return FALLBACK_VIDEO_URL;
  }
};