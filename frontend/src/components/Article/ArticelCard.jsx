import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  const getContentPreview = (content) => {
    return content?.length > 150 ? `${content.substring(0, 150)}...` : content;
  };

  return (
    <article className="bg-white shadow overflow-hidden rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              <Link
                to={`/articles/${article?.id}`}
                className="hover:text-indigo-600"
              >
                {article?.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">
              {getContentPreview(article?.content)}
            </p>

            {article?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article?.tags.map((tag, index) => (
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
          <Link
            to={`/articles/${article?.id}`}
            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
