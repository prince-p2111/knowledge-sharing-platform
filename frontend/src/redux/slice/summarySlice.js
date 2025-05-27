import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constant";

// Async thunk to get a summary
export const getSummary = createAsyncThunk(
  "summary/getSummary",
  async (articleId, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://${API_BASE_URL}/summary/create-summary/${articleId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch summary"
      );
    }
  }
);

const summarySlice = createSlice({
  name: "summary",
  initialState: {
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSummary: (state) => {
      state.summary = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Summary
      .addCase(getSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getSummary.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSummary } = summarySlice.actions;
export default summarySlice.reducer;
