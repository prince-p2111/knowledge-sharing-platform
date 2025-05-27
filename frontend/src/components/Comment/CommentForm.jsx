const CommentForm = ({ commentText, setCommentText, onSubmit }) => (
  <form onSubmit={onSubmit} className="mb-6">
    <div className="mb-3">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        rows="3"
        placeholder="Write your comment..."
        required
      ></textarea>
    </div>
    <button
      type="submit"
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    >
      Post Comment
    </button>
  </form>
);

export default CommentForm;
