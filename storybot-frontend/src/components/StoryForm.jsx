import { useState } from 'react';

export default function StoryForm({ onStories }) {
  const [subreddit, setSubreddit] = useState('popular');
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchStories = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/fetch-posts?subreddit=${subreddit}&limit=${limit}`);
      const data = await res.json();
      onStories(data.posts || []);
    } catch (err) {
      onStories([]);
    }
    setLoading(false);
  };

  return (
    <form className="p-4 bg-white rounded shadow" onSubmit={fetchStories}>
      <label className="block mb-2 font-mono text-muted">
        Subreddit:
        <input
          className="ml-2 px-2 py-1 border rounded font-mono"
          value={subreddit}
          onChange={e => setSubreddit(e.target.value)}
        />
      </label>
      <label className="block mb-2 font-mono text-muted">
        Limit:
        <input
          type="number"
          min={1}
          max={20}
          className="ml-2 px-2 py-1 border rounded font-mono"
          value={limit}
          onChange={e => setLimit(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="px-4 py-2 font-bold font-body bg-primary text-white rounded hover:bg-secondary"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Stories'}
      </button>
    </form>
  );
}
