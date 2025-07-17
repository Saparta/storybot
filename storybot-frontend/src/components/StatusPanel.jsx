const StatusPanel = ({ status }) => {
  if (!status) return null;

  return (
    <div className="mt-2 text-muted font-mono text-sm">
      {status}
    </div>
  );
};

export default StatusPanel;
