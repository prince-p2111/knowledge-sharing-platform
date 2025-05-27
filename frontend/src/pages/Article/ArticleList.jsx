import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArticles } from "@/redux/slice/articleSlice";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import ArticleListHeader from "@/components/Article/ArticleListHeader";
import ArticleCard from "@/components/Article/ArticelCard";
import EmptyState from "@/components/EmptyState";

const ArticleList = () => {
  const dispatch = useDispatch();
  const { articles, isLoading, error } = useSelector((state) => state.article);

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert error={error} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ArticleListHeader />

      <div className="space-y-6">
        {articles?.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article?.id} article={article} />
          ))
        ) : (
          <EmptyState
            title="No articles found"
            description="Get started by creating a new article."
          />
        )}
      </div>
    </div>
  );
};

export default ArticleList;
