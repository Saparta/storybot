import React from 'react';

const StoryPreview = ({ story }) => {
  if (!story) return null;

  // Estimate read time (200 words per minute)
  const wordCount = story.body.split(' ').length;
  const readTime = Math.ceil(wordCount / 200);

  // Split story body into paragraphs
  const paragraphs = story.body.split('\n\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));

  return (
    <div className="story-container">
      {/* Progress Indicator Placeholder */}
      <div className="progress-indicator-placeholder"></div>

      <h2 className="story-title">{story.title}</h2>
      <div className="story-meta">
        {readTime} min read &middot; Posted from r/{story.subreddit}
      </div>

      <div className="story-text">
        {paragraphs}
      </div>

      {/* Interaction Buttons Placeholder */}
      <div className="story-actions">
        <button>👍 Like</button>
        <button>🔄 Fetch New Story</button>
      </div>
    </div>
  );
};

export default StoryPreview;
