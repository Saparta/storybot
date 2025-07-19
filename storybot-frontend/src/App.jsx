import { useState, useRef } from 'react';
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
  const [subredditValid, setSubredditValid] = useState(true);
  const [subredditCheckMsg, setSubredditCheckMsg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [lastStoryIdx, setLastStoryIdx] = useState(null);
  const checkTimeout = useRef(null);
  const suggestTimeout = useRef(null);

  // Fetch stories and pick a random one (not the last shown)
  const fetchStory = async () => {
    setStatus('📥 Fetching story...');
    try {
      const res = await fetch(
        `/api/fetch-posts?subreddit=${subreddit}&limit=${limit}`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        let randomIdx;
        if (data.length === 1) {
          randomIdx = 0;
        } else {
          do {
            randomIdx = Math.floor(Math.random() * data.length);
          } while (randomIdx === lastStoryIdx && data.length > 1);
        }
        setAllStories(data);
        setLastStoryIdx(randomIdx);
        setStory(data[randomIdx]);
        setStatus('✅ Story loaded!');
      } else {
        setStory(null);
        setStatus('❌ No stories found.');
      }
    } catch (err) {
      setStatus('❌ Failed to fetch story.');
      setStory(null);
    }
  };

  // Suggest subreddits as user types (via backend proxy)
  const handleSubredditChange = (e) => {
    const value = e.target.value;
    setSubreddit(value);
    setSubredditValid(true);
    setSubredditCheckMsg('');
    setSuggestions([]);
    if (checkTimeout.current) clearTimeout(checkTimeout.current);
    if (suggestTimeout.current) clearTimeout(suggestTimeout.current);

    // Validate subreddit existence
    checkTimeout.current = setTimeout(async () => {
      if (!value) return;
      try {
        const res = await fetch(
          `/api/check-subreddit?name=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        if (data.valid) {
          setSubredditValid(true);
          setSubredditCheckMsg('✅ Subreddit found');
        } else {
          setSubredditValid(false);
          setSubredditCheckMsg('❌ Subreddit not found');
        }
      } catch {
        setSubredditValid(false);
        setSubredditCheckMsg('❌ Error checking subreddit');
      }
    }, 500);

    // Suggest subreddits
    suggestTimeout.current = setTimeout(async () => {
      if (!value) return;
      try {
        const res = await fetch(
          `/api/suggest-subreddits?query=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setSuggestions(data.subreddits || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  // Pick a different random story from the last shown
  const pickAnotherStory = () => {
    if (allStories.length < 2) return;
    let randomIdx;
    do {
      randomIdx = Math.floor(Math.random() * allStories.length);
    } while (randomIdx === lastStoryIdx);
    setLastStoryIdx(randomIdx);
    setStory(allStories[randomIdx]);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-sans font-bold text-primary mb-6">
        📖 Storybot
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            value={subreddit}
            onChange={handleSubredditChange}
            placeholder="Enter subreddit (e.g. pettyrevenge)"
            className={`w-full p-2 border rounded ${
              subredditValid ? '' : 'border-red-500'
            }`}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow">
              {suggestions.map((s) => (
                <li
                  key={s}
                  className="px-3 py-1 cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setSubreddit(s);
                    setSuggestions([]);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
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
          disabled={!subredditValid}
        >
          Fetch Story
        </button>
      </div>
      {subredditCheckMsg && (
        <div
          className={`mb-2 text-sm font-mono ${
            subredditValid ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {subredditCheckMsg}
        </div>
      )}
      <StatusPanel status={status} />
      {story && (
        <>
          <StoryPreview story={story} />
          <div className="mt-2 flex items-center gap-4">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-mono text-sm"
            >
              Source
            </a>
            {allStories.length > 1 && (
              <button
                onClick={pickAnotherStory}
                className="ml-2 px-3 py-1 bg-muted text-white rounded font-mono text-xs hover:bg-primary"
              >
                Show Another
              </button>
            )}
          </div>
        </>
      )}
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
