import { useNavigate } from "react-router-dom";

const ArticleHeader = ({ title, isAuthorOrAdmin, id, tags }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {isAuthorOrAdmin && (
          <button
            onClick={() => navigate(`/articles/new?edit=${id}`)}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Edit
          </button>
        )}
      </div>

      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleHeader;
