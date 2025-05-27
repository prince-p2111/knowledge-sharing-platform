const ArticleActions = ({
  onGenerateSummary,
  onShowHistory,
  showHistory,
  isAuthorOrAdmin,
}) => (
  <div className="flex flex-wrap gap-3 mt-6 border-t pt-4">
    <button
      onClick={onGenerateSummary}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    >
      Summarize
    </button>

    {isAuthorOrAdmin && (
      <button
        onClick={onShowHistory}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        {showHistory ? "Hide History" : "View History"}
      </button>
    )}
  </div>
);

export default ArticleActions;
