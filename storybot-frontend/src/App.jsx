import { useState } from 'react';
import StoryForm from './components/StoryForm.jsx';
import PreviewCard from './components/PreviewCard.jsx';

export default function App() {
  const [stories, setStories] = useState([]);

  return (
    <div className="min-h-screen p-8 bg-accent">
      <h1 className="font-sans text-3xl text-primary mb-6">Storybot: Reddit Story Fetcher</h1>
      <StoryForm onStories={setStories} />
      <div className="mt-6">
        {stories.map((story, idx) => (
          <PreviewCard key={idx} story={story} />
        ))}
      </div>
    </div>
  );
}
