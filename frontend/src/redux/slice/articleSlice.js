import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constant";

// Create new article
export const createArticle = createAsyncThunk(
  "article/create",
  async (articleData, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://${API_BASE_URL}/articles/create-article`,
        articleData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Update article
export const updateArticle = createAsyncThunk(
  "article/update",
  async ({ id, ...articleData }, thunkAPI) => {
    try {
      id = parseInt(id);
      const response = await axios.put(
        `http://${API_BASE_URL}/articles/update-article/${id}`,
        articleData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Fetch article by ID
export const fetchArticleById = createAsyncThunk(
  "article/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://${API_BASE_URL}/articles/get-article?id=${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Fetch all articles
export const fetchAllArticles = createAsyncThunk(
  "article/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://${API_BASE_URL}/articles/get-article`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Initial state
const initialState = {
  articles: [],
  currentArticle: null,
  isLoading: false,
  error: null,
};

// Slice
const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    clearArticleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Article
      .addCase(createArticle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles.push(action.payload.data.article);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Article
      .addCase(updateArticle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.articles.findIndex(
          (article) => article.id === action.payload.data.article.id
        );
        if (index !== -1) {
          state.articles[index] = action.payload.article;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchArticleById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentArticle = action.payload.data.article;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchAllArticles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data.articles;
      })
      .addCase(fetchAllArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearArticleError } = articleSlice.actions;
export default articleSlice.reducer;
