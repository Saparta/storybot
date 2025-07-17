const VideoPlayer = ({ videoURL }) => {
  if (!videoURL) return null;

  return (
    <div className="mt-6">
      <video className="w-full rounded-lg" controls>
        <source src={videoURL} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    </div>
  );
};

export default VideoPlayer;
