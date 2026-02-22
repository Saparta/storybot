import { GetListByKeyword } from 'youtube-search-api';

const FALLBACK_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // This is a Rickroll URL, consider changing!

const recommendedSearchTerms = [
  "BEST GTA 5 MEGA RAMP No Gameplay for TIKTOK & YOUTUBE 4K 60fps",
  "Minecraft Parkour Gameplay No Copyright (2 Hours)",
  "Ridiculous Drivers - Crashes & Wrecks Compilation | FailArmy"
];

let lastUsedIndex = 0;

function getNextSearchTerm() {
  const term = recommendedSearchTerms[lastUsedIndex];
  lastUsedIndex = (lastUsedIndex + 1) % recommendedSearchTerms.length;
  return term;
}

export const getTopYouTubeVideo = async () => { // Removed query parameter
  const searchQuery = getNextSearchTerm(); // Get search term from the rotating list
  console.log("[🎥] Searching YouTube for:", searchQuery);

  try {
    const result = await GetListByKeyword(searchQuery, false, 1);
    const videos = result.items.filter(item => item.type === 'video');

    if (videos.length === 0) {
      console.warn('No YouTube results found for query:', searchQuery, 'Using fallback.'); // Added query to log
      return FALLBACK_VIDEO_URL;
    }

    return `https://www.youtube.com/watch?v=${videos[0].id}`;
  } catch (err) {
    console.error('YouTube search failed for query:', searchQuery, err.message); // Added query to log
    return FALLBACK_VIDEO_URL;
  }
};
