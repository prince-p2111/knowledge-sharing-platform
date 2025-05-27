import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-100 to-orange-300 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
      >
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition"
          onClick={() => navigate("/")}
        >
          Go Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
