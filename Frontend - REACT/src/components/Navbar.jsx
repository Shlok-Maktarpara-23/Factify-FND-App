import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Home, Search, HelpCircle, CheckCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ activeContainer }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Data arrays
  const newsCategories = [
    { name: "Australia News", path: "/category/australia news" },
    { name: "Business", path: "/category/business" },
    { name: "Book", path: "/category/books" },
    { name: "Culture", path: "/category/culture" },
    { name: "Education", path: "/category/education" },
    { name: "Environment", path: "/category/environment" },
    { name: "Film", path: "/category/film" },
    { name: "Football", path: "/category/football" },
    { name: "Games", path: "/category/games" },
    { name: "Global Development", path: "/category/global development" },
    { name: "Life and Style", path: "/category/life and style" },
    { name: "Music", path: "/category/music" },
    { name: "Media", path: "/category/media" },
    { name: "Opinion", path: "/category/opinion" },
    { name: "Politics", path: "/category/politics" },
    { name: "Stage", path: "/category/stage" },
    { name: "Science", path: "/category/science" },
    { name: "Sport", path: "/category/sport" },
    { name: "Travel", path: "/category/travel" },
    { name: "Technology", path: "/category/technology" },
    { name: "US News", path: "/category/US news" },
    { name: "World News", path: "/category/world news" },
  ];

  const navLinks = [
    { name: "Check News By Title", path: "/checkbytitle", activeId: 2, icon: Search },
    { name: "News Quiz", path: "/newsquiz", activeId: 3, icon: HelpCircle },
    { name: "Feedback Dashboard", path: "/feedback", activeId: 4, icon: MessageSquare },
  ];

  // Effects
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [location]);

  // Helpers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const isLinkActive = (path, activeId) => location.pathname === path || activeContainer === activeId;

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shadow-xl border-b border-gray-600/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-white hover:text-gray-200 transition-colors duration-300 no-underline"
              style={{ textDecoration: 'none' }}
            >
              <CheckCircle className="w-8 h-8 text-gray-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Factify - FND
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={toggleCategories}
                className="flex items-center space-x-1 text-gray-200 hover:text-white px-3 py-2 rounded-lg transition-colors duration-300 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-medium">Categories</span>
                <motion.div
                  animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="py-2 max-h-80 overflow-y-auto">
                      {newsCategories.map((category, index) => (
                        <Link
                          key={index}
                          to={category.path}
                          className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Links */}
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              const isActive = isLinkActive(link.path, link.activeId);
              
              return (
                <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={link.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-blue-300 bg-blue-600/20 border border-blue-500/30"
                        : "text-gray-200 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="lg:hidden text-gray-200 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-300"
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
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-gray-800/95 backdrop-blur-sm rounded-xl mt-2 border border-gray-600/50 shadow-2xl overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-4 space-y-2">
                

                {/* Categories Toggle */}
                <button
                  onClick={toggleCategories}
                  className="flex items-center justify-between w-full text-gray-200 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <span>Categories</span>
                  <motion.div
                    animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Mobile Categories */}
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      className="pl-4 space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {newsCategories.map((category, index) => (
                        <Link
                          key={index}
                          to={category.path}
                          className="block text-gray-300 hover:text-white hover:bg-gray-700/30 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200"
                          onClick={toggleMenu}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Nav Links */}
                {navLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  const isActive = isLinkActive(link.path, link.activeId);
                  
                  return (
                    <Link
                      key={index}
                      to={link.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "text-blue-300 bg-blue-600/20"
                          : "text-gray-200 hover:text-white hover:bg-gray-700/50"
                      }`}
                      onClick={toggleMenu}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
