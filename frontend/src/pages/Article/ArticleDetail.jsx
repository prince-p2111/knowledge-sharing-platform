import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchArticleById } from "../../redux/slice/articleSlice";
import {
  addComment,
  fetchCommentsByArticleId,
} from "@/redux/slice/commentSlice";
import { getSummary } from "@/redux/slice/summarySlice";
import ArticleNotFound from "@/components/Article/ArticleNotFound";
import ArticleHeader from "@/components/Article/ArticleHeader";
import ArticleContent from "@/components/Article/ArticleContent";
import ArticleActions from "@/components/Article/ArticleActions";
import SummarySection from "@/components/Summary/SummarySection";
import HistorySection from "@/components/History/HistorySection";
import CommentForm from "@/components/Comment/CommentForm";
import CommentList from "@/components/Comment/CommentList";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";

const ArticleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentArticle, isLoading } = useSelector((state) => state.article);
  const { summary } = useSelector((state) => state.summary);
  const { comments } = useSelector((state) => state.comment);

  const [commentText, setCommentText] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isAuthorOrAdmin, setIsAuthorOrAdmin] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchArticleById(id));
    if (id) {
      dispatch(fetchCommentsByArticleId(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentArticle && user) {
      setIsAuthorOrAdmin(
        user.role === "admin" || user.id === currentArticle.authorId
      );
    }
  }, [currentArticle, user]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(
      addComment({
        article_id: id,
        content: commentText,
      })
    );
    setCommentText("");
  };

  const handleGenerateSummary = () => {
    dispatch(getSummary(id))
      .then((response) => {
        if (response.payload) {
          setShowSummary(true);
        }
      })
      .catch((error) => {
        console.error("Error generating summary:", error);
      });
  };

  const handleShowHistory = () => {
    if (!showHistory) {
      setIsHistoryLoading(true);
      dispatch(fetchArticleById(id))
        .then((response) => {
          if (response.payload?.data?.revisions) {
            setHistory(response.payload.data.revisions);
          }
        })
        .catch((error) => {
          console.error("Error fetching history:", error);
        })
        .finally(() => {
          setIsHistoryLoading(false);
        });
    }
    setShowHistory(!showHistory);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleNotFound />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Content */}
      <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div className="p-6">
          <ArticleHeader
            title={currentArticle.title}
            isAuthorOrAdmin={isAuthorOrAdmin}
            id={id}
            tags={currentArticle.tags}
          />

          <ArticleContent content={currentArticle.content} />

          <ArticleActions
            onGenerateSummary={handleGenerateSummary}
            onShowHistory={handleShowHistory}
            showHistory={showHistory}
            isAuthorOrAdmin={isAuthorOrAdmin}
          />
        </div>
      </div>

      {/* Summary Section */}
      {showSummary && summary && <SummarySection summary={summary} />}

      {/* History Section */}
      {showHistory && isAuthorOrAdmin && (
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit History
            </h3>
            <HistorySection
              history={history}
              isHistoryLoading={isHistoryLoading}
            />
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>

          {/* Comment Form */}
          {user && (
            <CommentForm
              commentText={commentText}
              setCommentText={setCommentText}
              onSubmit={handleAddComment}
            />
          )}

          {/* Comments List */}
          <CommentList comments={comments} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
