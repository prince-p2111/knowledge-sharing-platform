import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { checkAuth } from "./redux/slice/authSlice";
import CheckAuth from "./components/common/CheckAuth";
import AuthLayout from "./components/layouts/AuthLayout";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ArticleLayout from "./components/layouts/ArticleLayout";
import ArticleList from "./pages/Article/ArticleList";
import ArticleDetail from "./pages/Article/ArticleDetail";
import ArticleForm from "./pages/Article/ArticleForm";
import UnAuthPage from "./pages/UnAuthPage/UnAuthPage";
import NotFound from "./pages/NotFound/NotFound";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ArticleLayout />}>
          <Route index element={<ArticleList />} />
          <Route path="articles" element={<ArticleList />} />
        </Route>

        {/* Protected Route: Only for creating new articles */}
        <Route
          path="/articles"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ArticleLayout />
            </CheckAuth>
          }
        >
          <Route path="" element={<ArticleList />} />
          <Route path="new" element={<ArticleForm />} />
          <Route path=":id" element={<ArticleDetail />} />
        </Route>

        {/* Auth Routes (login/signup - only visible if NOT logged in) */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        {/* Other Routes */}
        <Route path="/unauth-page" element={<UnAuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
