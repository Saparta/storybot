export default function PreviewCard({ story }) {
  return (
    <div className="p-4 my-2 bg-accent rounded shadow">
      <h2 className="font-sans text-xl text-primary mb-2">{story.title}</h2>
      <p className="font-body text-secondary">{story.body}</p>
    </div>
  );
}
