import { useState } from 'react';
import StoryPreview from './components/StoryPreview.jsx';
import GenerateButton from './components/GenerateButton.jsx';
import VideoPlayer from './components/VideoPlayer.jsx';
import StatusPanel from './components/StatusPanel.jsx';
import './App.css';

function App() {
  const [story, setStory] = useState(null);
  const [status, setStatus] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch a random story from the backend
  const fetchRandomStory = async () => {
    setLoading(true);
    setStory(null);
    setStatus('🎲 Fetching random story...');
    setVideoURL('');
    
    // Use explicit URL for fetch to potentially diagnose proxy issue
    const baseUrl = window.location.origin; 
    const apiUrl = `${baseUrl}/api/fetch-random-story`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data && data.title && data.body) {
        setStory(data);
        setStatus('✅ Random story loaded!');
      } else {
        setStory(null);
        setStatus('❌ Could not fetch a random story.');
      }
    } catch (err) { // Corrected catch block placement
      setStatus('❌ Failed to fetch random story.');
      setStory(null);
      console.error('Error fetching random story:', err);
    } finally {
      setLoading(false);
    }
  }; // Corrected closing curly brace

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-sans font-bold text-primary mb-8">📖 Storybot</h1>
      <div className="w-full max-w-lg flex flex-col items-center mb-4">
        <button
          onClick={fetchRandomStory}
          className={`bg-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            '🎲 Fetch Random Reddit Story'
          )}
        </button>
      </div>

      <StatusPanel status={status} />

      {story && (
        <div className="w-full max-w-lg mt-6 bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <h2 className="text-xl font-bold mb-2 text-gray-800">{story.title}</h2>
          {/* Display full body text */}
          <p className="text-gray-700 mb-4" style={{ whiteSpace: 'pre-wrap' }}>{story.body}</p>
          <div className="flex items-center gap-4">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline font-mono text-sm"
            >
              Source
            </a>
            {/* Display subreddit name if available */}
            {story.subreddit && (
               <span className="text-gray-500 font-mono text-sm">r/{story.subreddit}</span>
            )}
          </div>
        </div>
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
