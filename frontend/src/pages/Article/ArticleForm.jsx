import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createArticle,
  updateArticle,
  fetchArticleById,
} from "../../redux/slice/articleSlice";
import ErrorAlert from "@/components/ErrorAlert";
import FormInput from "@/components/FormInput";
import FormButtons from "@/components/FormButton";

const ArticleForm = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("edit");
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, currentArticle } = useSelector(
    (state) => state.article
  );

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchArticleById(id));
    }
  }, [id, dispatch, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentArticle) {
      setFormData({
        title: currentArticle.title,
        content: currentArticle.content,
      });
      setTags(currentArticle.tags || []);
      setTagInput(currentArticle.tags?.join(", ") || "");
    }
  }, [currentArticle, isEditMode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (formData.content.trim().length < 100) {
      newErrors.content = "Content must be at least 100 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const processTags = (tagString) => {
    return tagString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const processedTags = processTags(tagInput);

    const articleData = {
      ...formData,
      tags: processedTags,
    };

    try {
      if (isEditMode) {
        await dispatch(updateArticle({ id, ...articleData })).unwrap();
      } else {
        await dispatch(createArticle(articleData)).unwrap();
      }
      navigate("/articles");
    } catch (err) {
      console.error("Failed to save article:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Edit Article" : "Create New Article"}
        </h2>

        <ErrorAlert error={error} />

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter article title"
            required
          />

          <FormInput
            label="Content"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            error={errors.content}
            placeholder="Write your article content here..."
            type="textarea"
            rows={12}
            required
            showCharCount
            charCount={formData.content.length}
            minCharCount={100}
          />

          <div className="mb-8">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="technology, programming, web development"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas
            </p>

            {/* Display tags as chips/badges */}
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
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

          <FormButtons
            isLoading={isLoading}
            isEditMode={isEditMode}
            submitLabel={isEditMode ? "Update Article" : "Publish Article"}
          />
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
