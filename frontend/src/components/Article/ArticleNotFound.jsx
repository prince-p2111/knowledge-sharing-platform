import { useNavigate } from "react-router-dom";

const ArticleNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-900">Article not found</h2>
      <button
        onClick={() => navigate("/articles")}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Back to Articles
      </button>
    </div>
  );
};

export default ArticleNotFound;
