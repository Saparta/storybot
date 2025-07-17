import React from 'react';

const GenerateButton = ({ story, setStatus, setVideoURL }) => {
  const runFullPipeline = async () => {
    if (!story) return;

    try {
      setStatus("🗣 Generating voiceover...");
      const ttsRes = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `${story.title}\n\n${story.body}` }),
      });
      const { audioUrl } = await ttsRes.json();

      setStatus("🔍 Searching YouTube for background...");
      const ytRes = await fetch("/api/search-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "funny fails video comp 9:16" }),
      });
      const { videoUrl } = await ytRes.json();

      setStatus("🎞 Composing final video...");
      const compRes = await fetch("/api/compose-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl,
          videoUrl,
          captionText: `${story.title}\n\n${story.body}`,
        }),
      });
      const { videoPath } = await compRes.json();

      setVideoURL(`/videos/${videoPath.split("/").pop()}`);
      setStatus("✅ Video ready!");
    } catch (err) {
      console.error("Error in generation pipeline", err);
      setStatus("❌ Failed to generate video.");
    }
  };

  return (
    <button
      onClick={runFullPipeline}
      disabled={!story}
      className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded shadow hover:bg-secondary transition"
    >
      🎬 Generate Video
    </button>
  );
};

export default GenerateButton;
