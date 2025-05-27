import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const UnAuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 max-w-md w-full animate-fade-in-up">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-orange-400 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div className="absolute -inset-4 border-2 border-blue-300 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/80 mb-6">
            You don't have permission to view this page
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/30"
            >
              Return Home
            </Button>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/60">
              Need help?{" "}
              <span className="text-orange-300">support@yourcompany.com</span>
            </p>
          </div>
        </div>
        <div className="bg-black/10 p-4 text-center text-white/50 text-xs">
          <span className="text-blue-300 font-medium">iClean industries</span> •
          Unauthorized access attempt
        </div>
      </div>
    </div>
  );
};

export default UnAuthPage;
