import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LogOut, Menu, X, User, CheckCircle, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Header = () => {
  const { isLoggedIn, setLoggedIn, username, setUsername } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    ["accessToken", "refreshToken"].forEach((token) =>
      localStorage.removeItem(token)
    );
    setLoggedIn(false);
    setUsername("");

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        axios.post(
          "http://127.0.0.1:8000/api/user/logout/",
          { refresh: refreshToken },
          { 
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            timeout: 3000 
          }
        ).catch((error) => {
          console.log("Logout API completed (errors are normal):", error.response?.status);
        });
      }
    } catch (error) {
      console.log("Logout API error (this is normal):", error.message);
    }
    navigate("/", { replace: true });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const UserAvatar = ({ name }) => (
    <motion.div
      className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {name?.charAt(0)?.toUpperCase() || "U"}
    </motion.div>
  );

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const logoVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shadow-xl border-b border-gray-600/50"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div variants={logoVariants} whileHover="hover" whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className="flex items-center space-x-3 text-white hover:text-gray-200 transition-colors duration-300 no-underline"
              style={{ textDecoration: "none" }}
            >
              <CheckCircle className="w-8 h-8 text-gray-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Factify
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <motion.div
                className="flex items-center space-x-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Explore App Button */}
                <motion.div variants={itemVariants}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/home"
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl transition-all duration-300 h-10 w-30 font-medium shadow-lg hover:shadow-xl no-underline"
                      style={{ textDecoration: "none" }}
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explore</span>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Logout Button */}
                <motion.div variants={itemVariants}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all duration-300 h-10 w-30 font-medium shadow-lg hover:shadow-xl"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </motion.div>

                {/* Username Display */}
                <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                  <UserAvatar name={username} />
                  <span className="text-gray-100 text-sm font-medium">{username}</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center space-x-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/login"
                      className="flex items-center justify-center text-gray-100 hover:text-white border border-gray-400/50 hover:border-gray-300 bg-gray-600/40 hover:bg-gray-500/60 px-5 py-2 rounded-xl transition-all duration-300 h-10 w-24 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm no-underline"
                      style={{ textDecoration: "none" }}
                    >
                      Login
                    </Link>
                  </motion.div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/register"
                      className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-xl border border-blue-500/50 hover:border-blue-400 transition-all duration-300 h-10 w-24 font-medium backdrop-blur-sm no-underline"
                      style={{ textDecoration: "none" }}
                    >
                      Register
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden text-gray-200 hover:text-white p-2 rounded-xl hover:bg-gray-600/50 transition-colors duration-300 w-10 h-10 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  exit={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-gray-700/90 backdrop-blur-md rounded-xl mt-2 p-4 overflow-hidden border border-gray-500/50 shadow-2xl"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {isLoggedIn ? (
                <div className="space-y-4">
                  <Link
                    to="/home"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl transition-all duration-300 h-10 font-medium shadow-lg no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore App</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all duration-300 h-10 font-medium shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>

                  <div className="flex items-center justify-center space-x-3 p-2">
                    <UserAvatar name={username} />
                    <span className="text-gray-100 text-sm font-medium">{username}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center text-gray-100 hover:text-white border border-gray-400/50 hover:border-gray-300 bg-gray-600/50 hover:bg-gray-500/70 px-5 py-2 rounded-xl transition-all duration-300 w-full h-10 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-xl border border-blue-500/50 hover:border-blue-400 transition-all duration-300 w-full h-10 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
