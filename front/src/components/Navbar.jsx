import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full bg-red-600 text-white flex justify-between items-center px-8 py-3 fixed top-0 left-0 z-50 shadow-md"
      style={{ minHeight: "48px" }} // reduced height
    >
      <div
        className="text-lg font-bold cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        BAYMAX
      </div>
      <div className="space-x-5 hidden md:flex text-sm font-medium">
        <button onClick={() => navigate("/")} className="hover:underline">
          Home
        </button>
        <button onClick={() => navigate("/reviews")} className="hover:underline">
          Reviews
        </button>
        <button onClick={() => navigate("/contact")} className="hover:underline">
          Contact
        </button>
        <button
          onClick={() => navigate("/auth")}
          className="bg-white text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition"
        >
          Sign In
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
