import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to knowledge sharing platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* This Outlet will render your login/signup components */}
          <Outlet />
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
