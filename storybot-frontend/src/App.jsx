import { useState } from "react";
import GenerateButton from "./components/GenerateButton.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import StatusPanel from "./components/StatusPanel.jsx";
import "./App.css";

function App() {
  const [story, setStory] = useState(null);
  const [status, setStatus] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRandomStory = async () => {
    setLoading(true);
    setStory(null);
    setStatus("🎲 Fetching random story...");
    setVideoURL("");

    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/fetch-random-story`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data && data.title && data.body) {
        setStory(data);
        setStatus("✅ Random story loaded!");
      } else {
        setStory(null);
        setStatus("❌ Could not fetch a random story.");
      }
    } catch (err) {
      setStatus("❌ Failed to fetch random story.");
      setStory(null);
      console.error("Error fetching random story:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg"
      >
        <source
          src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="background-overlay" />

      <main className="content-layer flex flex-col items-center min-h-screen p-4">
        <h1 className="text-4xl font-sans font-bold text-white mb-8 drop-shadow-lg">
          📖 Storybot Studio
        </h1>

        <div className="glass-card w-full max-w-xl flex flex-col items-center mb-6 p-6">
          <p className="text-sm text-slate-100 mb-4 text-center">
            One-click Reddit story video generator with a gameplay-style background.
          </p>
          <button
            onClick={fetchRandomStory}
            className={`bg-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading story..." : "🎲 Fetch Random Reddit Story"}
          </button>
        </div>

        <div className="w-full max-w-xl">
          <StatusPanel status={status} />
        </div>

        {story && (
          <div className="glass-card w-full max-w-xl mt-6 p-6 animate-fade-in text-left">
            <h2 className="text-xl font-bold mb-2 text-white">{story.title}</h2>
            <p className="text-slate-100 mb-4" style={{ whiteSpace: "pre-wrap" }}>
              {story.body}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-200 underline font-mono text-sm"
              >
                Source
              </a>
              {story.subreddit && (
                <span className="text-slate-200 font-mono text-sm">r/{story.subreddit}</span>
              )}
            </div>
          </div>
        )}

        <GenerateButton story={story} setStatus={setStatus} setVideoURL={setVideoURL} />
        <VideoPlayer videoURL={videoURL} />
      </main>
    </div>
  );
}

export default App;
