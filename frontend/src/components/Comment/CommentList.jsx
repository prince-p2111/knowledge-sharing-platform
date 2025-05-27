const CommentList = ({ comments }) => (
  <div className="space-y-4">
    {comments?.length > 0 ? (
      comments.map((comment) => (
        <div key={comment?.id} className="border-b pb-4 last:border-b-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-gray-900">
              {comment?.author?.name}
            </h4>
            <span className="text-sm text-gray-500">
              {new Date(comment?.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-700">{comment?.content}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No comments yet. Be the first to comment!</p>
    )}
  </div>
);

export default CommentList;
