const StoryPreview = ({ story }) => {
  if (!story) return null;

  return (
    <div className="bg-white text-muted p-6 rounded shadow-md mt-4">
      <h2 className="text-2xl font-semibold text-primary font-sans mb-2">
        {story.title}
      </h2>
      <p className="text-base font-body leading-relaxed whitespace-pre-line">
        {story.body}
      </p>
    </div>
  );
};

export default StoryPreview;
