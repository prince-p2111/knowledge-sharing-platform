import LoadingSpinner from "../Spinner/LoadingSpinner";

const HistorySection = ({ history, isHistoryLoading }) => {
  if (isHistoryLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner size={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.length > 0 ? (
        history?.map((revision) => (
          <div key={revision.id} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-500">
                {new Date(revision.revised_at).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                Edited by: {revision.editor?.name || "Unknown"}
              </span>
            </div>
            <div className="mb-2">
              <h4 className="font-medium">{revision.title}</h4>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700">{revision.content_preview}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No edit history available</p>
      )}
    </div>
  );
};

export default HistorySection;
