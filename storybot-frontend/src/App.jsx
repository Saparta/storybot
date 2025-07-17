import { useState } from 'react';
import StoryPreview from './components/StoryPreview.jsx';
import GenerateButton from './components/GenerateButton.jsx';
import VideoPlayer from './components/VideoPlayer.jsx';
import StatusPanel from './components/StatusPanel.jsx';
import './App.css';

function App() {
  const [subreddit, setSubreddit] = useState('pettyrevenge');
  const [limit, setLimit] = useState(1);
  const [story, setStory] = useState(null);
  const [status, setStatus] = useState('');
  const [videoURL, setVideoURL] = useState('');

  const fetchStory = async () => {
    setStatus('📥 Fetching story...');
    try {
      const res = await fetch(
        `/api/fetch-posts?subreddit=${subreddit}&limit=${limit}`
      );
      const data = await res.json();
      setStory(data[0] || null);
      setStatus('✅ Story loaded!');
    } catch (err) {
      setStatus('❌ Failed to fetch story.');
      setStory(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-sans font-bold text-primary mb-6">
        📖 Storybot
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          placeholder="Enter subreddit (e.g. pettyrevenge)"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="number"
          min={1}
          max={5}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-24 p-2 border rounded"
        />
        <button
          onClick={fetchStory}
          className="bg-secondary text-white px-4 py-2 rounded font-bold hover:bg-primary transition"
        >
          Fetch Story
        </button>
      </div>
      <StatusPanel status={status} />
      <StoryPreview story={story} />
      <GenerateButton
        story={story}
        setStatus={setStatus}
        setVideoURL={setVideoURL}
      />
      <VideoPlayer videoURL={videoURL} />
    </div>
  );
}

export default App;
              