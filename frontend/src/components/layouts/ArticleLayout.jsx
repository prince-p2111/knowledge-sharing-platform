import { logout } from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ArticleLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  const logoutAction = () => {
    localStorage.removeItem("user");
    dispatch(logout())
      .then((data) => {
        if (data.payload?.success) {
          navigate("/auth/login"); // Redirect to login page
        }
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                to="/articles"
                className="text-xl font-bold text-indigo-600"
              >
                ArticleHub
              </Link>
              <nav className="ml-10 hidden md:flex space-x-8">
                <Link
                  to="/articles"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Articles
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/articles/new"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    New Article
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    Hi, {user?.name || "User"}
                  </span>
                  <button
                    onClick={logoutAction}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium border border-indigo-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className="md:hidden bg-white shadow-sm">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/articles"
            className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Articles
          </Link>
          {isAuthenticated && (
            <Link
              to="/articles/new"
              className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              New Article
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet /> {/* This will render the nested routes */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ArticleHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArticleLayout;
