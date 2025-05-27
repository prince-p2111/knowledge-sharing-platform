import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constant";

// Add new comment
export const addComment = createAsyncThunk(
  "comment/add",
  async ({ article_id, content }, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://${API_BASE_URL}/comment/create-comment`,
        { article_id, content },
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

// Fetch all comments by article ID
export const fetchCommentsByArticleId = createAsyncThunk(
  "comment/fetchByArticleId",
  async (articleId, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://${API_BASE_URL}/comment/get-comment/${articleId}`,
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

// Optional: Delete comment (admin/mod only)
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async ({ articleId, commentId }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `http://${API_BASE_URL}/articles/delete-comment/${commentId}`,
        {
          withCredentials: true,
        }
      );
      return { commentId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  comments: [],
  isLoading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload.data);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Comments
      .addCase(fetchCommentsByArticleId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCommentsByArticleId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.data;
      })
      .addCase(fetchCommentsByArticleId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;
