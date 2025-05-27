import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constant";

export const adminLogin = createAsyncThunk("/auth/login", async (userData) => {
  try {
    const response = await axios.post(
      `http://${API_BASE_URL}/auth/login`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const signup = createAsyncThunk("/auth/signup", async (userData) => {
  try {
    const response = await axios.post(
      `http://${API_BASE_URL}/auth/signup`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://${API_BASE_URL}/auth/check-auth`,
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control":
              "no-cache, no-store, must-revalidate, proxy-revalidate",
          },
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error(response?.data?.message || "Authorization failed");
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.get(`http://${API_BASE_URL}/auth/logout`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-cache, no-store, must-revalidate, proxy-revalidate",
        },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(response?.data?.message || "Authorization failed");
      }

      return response.data;
    } catch (error) {
      console.log(error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action?.payload?.data || null;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action?.payload?.data));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.success ? action.payload.user : null;
        state.isAuthenticated = action.payload?.success ? true : false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action?.payload?.data || null;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action?.payload?.data));
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
