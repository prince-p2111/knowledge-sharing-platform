import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import articleReducer from "./slice/articleSlice";
import commentReducer from "./slice/commentSlice";
import summaryReducer from "./slice/summarySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    article: articleReducer,
    comment: commentReducer,
    summary: summaryReducer,
  },
});
