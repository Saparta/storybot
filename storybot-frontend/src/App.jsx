import { useState } from 'react';
import StoryForm from './components/StoryForm.jsx';
import StoryPreview from './components/StoryPreview.jsx';
import GenerateButton from './components/GenerateButton.jsx';
import VideoPlayer from './components/VideoPlayer.jsx';
import StatusPanel from './components/StatusPanel.jsx';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [subreddit, setSubreddit] = useState('pettyrevenge');
  const [limit, setLimit] = useState(1);
  const [story, setStory] = useState(null);
  const [status, setStatus] = useState('');
  const [videoURL, setVideoURL] = useState('');

  const fetchStory = async () => {
    setStatus('📥 Fetching story...');
    const res = await fetch(
      `/api/fetch-posts?subreddit=${subreddit}&limit=${limit}`
    );
    const data = await res.json();
    setStory(data[0]);
    setStatus('✅ Story loaded!');
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="min-h-screen p-8 bg-accent">
        <h1 className="font-sans text-3xl text-primary mb-6">
          Storybot: Reddit Story to Video
        </h1>
        <StoryForm onStories={setStories} />
        <div className="mt-6">
          {selectedStory && (
            <>
              <StoryPreview
                title={selectedStory.title}
                body={selectedStory.body}
              />
              <GenerateButton
                story={selectedStory}
                setStatus={setStatus}
                setVideoURL={setVideoURL}
                disabled={!!videoURL || !selectedStory}
              />
              <StatusPanel status={status} />
              {videoURL && <VideoPlayer videoURL={videoURL} />}
            </>
          )}
        </div>
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
    </>
  );
}

export default App;
