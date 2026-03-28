import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Loader2, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

const CheckByTitle = () => {
  document.title = "Factify - FND | Check news by title";
  
  const [inputNewsTitle, setNewsTitle] = useState("");
  const [predictedValue, setPredictedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous states
    setPredictedValue("");
    setError("");

    // Validation
    if (inputNewsTitle.trim().length < 1) {
      setError("Please enter a news title to check!");
      return;
    }

    if (inputNewsTitle.trim().length < 10) {
      setError("News title should be at least 10 characters long!");
      return;
    }

    setIsLoading(true);

    const dataToSend = {
      user_news: inputNewsTitle.trim(),
    };

    try {
      const response = await Axios.post("http://127.0.0.1:8000/api/news/usercheck/title/", dataToSend);
      
      if (response.data.prediction === true) {
        setPredictedValue("True");
      } else {
        setPredictedValue("False");
      }
    } catch (error) {
      console.error("Error submitting data: ", error);
      setError("Failed to check news. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        type: "spring",
        stiffness: 200,
        damping: 20
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -20, 
      transition: { duration: 0.3 } 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex flex-col">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.08),_transparent_50%)] -z-40"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(168,85,247,0.08),_transparent_50%)] -z-30"></div>
      
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/home"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <div className="mb-6">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full border border-blue-500/30 mb-4"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Search className="w-8 h-8 text-blue-400" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
              Check News by Title
            </h1>
            <p className="text-xl text-gray-200 mb-2">
              Enter a news title to verify its authenticity with AI
            </p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 md:p-10 shadow-2xl"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newsTitle" className="block text-lg font-semibold text-gray-200 mb-3">
                  News Title
                </label>
                <textarea
                  id="newsTitle"
                  rows={4}
                  className="block w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg resize-none"
                  placeholder="Enter the news title you want to check... (minimum 10 characters)"
                  value={inputNewsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || inputNewsTitle.trim().length < 1}
                className="w-full flex items-center justify-center py-4 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-xl rounded-xl shadow-2xl border border-blue-500/50 hover:border-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-6 h-6 mr-3" />
                    Checking News...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-3" />
                    Check News
                  </>
                )}
              </motion.button>
            </form>

            {/* Results Section */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {/* Error Message */}
                {error && (
                  <motion.div
                    className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center"
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key="error"
                  >
                    <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-300 mb-2">Error</h3>
                    <p className="text-red-200">{error}</p>
                  </motion.div>
                )}

                {/* Real News Result */}
                {predictedValue === "True" && (
                  <motion.div
                    className="bg-green-500/20 border border-green-500/50 rounded-xl p-8 text-center"
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key="true"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-green-300 mb-3">Real News!</h3>
                    <p className="text-green-200 text-lg">
                      Our AI analysis indicates this appears to be legitimate news content.
                    </p>
                  </motion.div>
                )}

                {/* Fake News Result */}
                {predictedValue === "False" && (
                  <motion.div
                    className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center"
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key="false"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-red-300 mb-3">Fake News!</h3>
                    <p className="text-red-200 text-lg">
                      Our AI analysis suggests this may be misinformation or fake content.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckByTitle;
