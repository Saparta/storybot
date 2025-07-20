import React from 'react';

const GenerateButton = ({ story, setStatus, setVideoURL }) => {
  const runFullPipeline = async () => {
    if (!story) return;

    console.log('[🎬] Starting generation pipeline');
    // setStatus("🗣 Generating voiceover..."); // Temporarily disable TTS status

    // Prepare text for TTS (keeping the variable but not using the fetch for now)
    const textForTTS = `${story.title}

${story.body}`;
    console.log('[📤] TTS Payload (currently unused):', textForTTS);

    try {
      // *** Skipping TTS step ***
      const audioUrl = null; // Set audioUrl to null or undefined
      console.log('[⏭️] Skipping TTS step.');

      console.log('🔍 Searching YouTube for background...');
      setStatus("🔍 Searching YouTube for background...");
      // Use the new GET route for fetching YouTube video
      const ytRes = await fetch("/api/fetch-youtube-video"); // Changed to GET and removed body
      const ytResult = await ytRes.json();
      console.log('[📥] YouTube Response:', ytResult);

       // Validate YouTube response
      if (!ytResult || !ytResult.videoUrl) {
        console.error('❌ Invalid YouTube response:', ytResult);
        setStatus('❌ Failed to find background video.');
        return;
      }
      const { videoUrl } = ytResult;

      console.log('🎞 Composing final video...');
      setStatus("🎞 Composing final video...");
      const compRes = await fetch("/api/compose-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl, // Will be null or undefined
          videoUrl,
          captionText: `${story.title}

${story.body}`,
        }),
      });
      
       // Log raw compose response for debugging
      const rawCompResponse = await compRes.text();
      console.log('[📥 Raw Compose Response Text]:', rawCompResponse);

      const compResult = JSON.parse(rawCompResponse); // Manually parse
      console.log('[📥] Compose Response:', compResult);

      // Validate Compose response and extract videoPath
      if (!compResult || !compResult.videoPath) {
          console.error('❌ Invalid Compose response:', compResult);
          setStatus('❌ Failed to compose video.');
          return;
      }
      const { videoPath } = compResult;      

      console.log('[✅] Video ready!');
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
