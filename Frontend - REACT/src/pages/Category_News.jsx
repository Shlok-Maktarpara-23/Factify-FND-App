import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  CheckCircle,
  X,
  Calendar,
  Globe,
  ArrowLeft,
  Filter,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import NewsFeedback from "@/components/NewsFeedback"; // Import the feedback component

const CategoryNews = () => {
  const { category } = useParams();
  // console(category)
  
  // States
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackCounts, setFeedbackCounts] = useState({}); // Store feedback counts
  const [userFeedbacks, setUserFeedbacks] = useState({}); // Store user's feedback
  const newsPerPage = 15;

  // Function to format category name for display
  const formatCategoryName = (categoryName) => {
    if (!categoryName) return "";

    const specialCases = {
      lifeandstyle: "Life and Style",
      artanddesign: "Art and Design",
      usnews: "US News",
      commentisfree: "Comment Is Free",
      tvandradio: "TV and Radio",
      uknews: "UK News",
    };

    if (specialCases[categoryName.toLowerCase()]) {
      return specialCases[categoryName.toLowerCase()];
    }

    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to handle image URL format (both list and string formats)
  const getImageUrl = (imgUrl) => {
    if (!imgUrl || imgUrl === "None") return null;
    
    // If it's a string that looks like a list, parse it
    if (typeof imgUrl === 'string' && imgUrl.startsWith('[') && imgUrl.endsWith(']')) {
      try {
        // Remove brackets and quotes, split by comma
        const cleanedUrl = imgUrl.slice(1, -1).replace(/['"]/g, '').trim();
        if (cleanedUrl) {
          return cleanedUrl.split(',')[0].trim(); // Get first URL if multiple
        }
      } catch (error) {
        console.error('Error parsing image URL:', error);
      }
    }
    
    // If it's already a clean string URL
    if (typeof imgUrl === 'string' && !imgUrl.startsWith('[')) {
      return imgUrl;
    }
    
    // If it's an array, take the first element
    if (Array.isArray(imgUrl) && imgUrl.length > 0) {
      return imgUrl[0];
    }
    
    return null;
  };

  // Fetch feedback data for news items
  const fetchFeedbackData = async (newsIds) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      // Fetch feedback counts and user's feedback for all news items
      const feedbackPromises = newsIds.map(async (newsId) => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/news/${newsId}/feedback/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          });
          return { newsId, data: response.data };
        } catch (error) {
          console.error(`Error fetching feedback for news ${newsId}:`, error);
          return { newsId, data: null };
        }
      });

      const results = await Promise.all(feedbackPromises);
      
      const newFeedbackCounts = {};
      const newUserFeedbacks = {};
      
      results.forEach(({ newsId, data }) => {
        if (data) {
          newFeedbackCounts[newsId] = data.total_feedback_count || 0;
          if (data.user_feedback) {
            newUserFeedbacks[newsId] = data.user_feedback;
          }
        }
      });

      setFeedbackCounts(newFeedbackCounts);
      setUserFeedbacks(newUserFeedbacks);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  // Fetch news data for the category
  const fetchNewsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      const response = await axios.get(`http://127.0.0.1:8000/api/news/category/${capitalizedCategory}/`);
      
      setNewsData(response.data);
      setCurrentPage(1); // Reset to first page when new data loads
      
      // Fetch feedback data for the news items
      const newsIds = response.data.map(news => news.id).filter(id => id);
      if (newsIds.length > 0) {
        await fetchFeedbackData(newsIds);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(`Failed to fetch ${formatCategoryName(category)} news`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `Factify - FND | ${formatCategoryName(category)}`;
    fetchNewsData();
  }, [category]);

  // Handle feedback submission
  const handleFeedbackSubmit = (newsId, feedbackData) => {
    console.log('Feedback submitted for news:', newsId, feedbackData);
    
    // Update feedback count
    setFeedbackCounts(prev => ({
      ...prev,
      [newsId]: (prev[newsId] || 0) + 1
    }));

    // Update user feedback
    setUserFeedbacks(prev => ({
      ...prev,
      [newsId]: feedbackData
    }));
  };

  // Pagination logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(newsData.length / newsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // News Card Component with Feedback
  const NewsCard = ({ news, index }) => {
    const imageUrl = getImageUrl(news.img_url);
    const newsId = news.id;
    const feedbackCount = feedbackCounts[newsId] || 0;
    const userFeedback = userFeedbacks[newsId] || null;
    
    return (
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden hover:border-gray-500/50 group"
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -5 }}
      >
        {/* Image Section */}
        {imageUrl && (
          <div className="h-56 overflow-hidden relative">
            <img
              src={imageUrl}
              alt={`News ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 space-y-4 min-h-[280px] flex flex-col justify-between">
          <div className="space-y-3">
            {/* Category Badge */}
            {news.news_category && (
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Globe className="w-3 h-3 mr-1" />
                  {news.news_category}
                </span>
              </div>
            )}

            {/* Title - Full display */}
            <h3 className="text-lg font-bold text-white leading-tight hover:text-blue-300 cursor-pointer transition-colors min-h-[4rem]">
              {news.title}
            </h3>

            {/* Section Name */}
            {news.section_name && (
              <p className="text-sm text-gray-300">
                <span className="font-medium">Section:</span> {news.section_name}
              </p>
            )}
          </div>

          {/* Footer Section */}
          <div className="space-y-3 mt-auto">
            {/* Publication Date */}
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>{formatDate(news.publication_date)}</span>
            </div>

            {/* Prediction Badge and Read More */}
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                news.prediction
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
                {news.prediction ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Real News
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Fake News
                  </>
                )}
              </div>

              {/* Read More Link */}
              {news.web_url && (
                <a
                  href={news.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline transition-colors"
                >
                  Read More →
                </a>
              )}
            </div>

            {/* Feedback Section */}
            {newsId && (
              <NewsFeedback
                newsId={newsId}
                newsTitle={news.title}
                prediction={news.prediction}
                onFeedbackSubmit={(feedbackData) => handleFeedbackSubmit(newsId, feedbackData)}
                userFeedback={userFeedback}
                feedbackCount={feedbackCount}
              />
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <motion.div 
        className="flex justify-center items-center space-x-2 mt-12"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        <div className="flex space-x-1">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === number
                  ? "bg-blue-600 text-white border border-blue-500"
                  : "bg-gray-800/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </motion.div>
    );
  };

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
        <Header />
        <div className="text-center pt-24">
          <Loader2 className="animate-spin h-16 w-16 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-200 text-lg">Loading {formatCategoryName(category)} news...</p>
        </div>
      </div>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading News</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-x-4">
              <motion.button
                onClick={fetchNewsData}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </motion.button>
              <Link
                to="/home"
                className="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No Data Component
  if (newsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No News Available</h2>
            <p className="text-gray-300 mb-6">
              No {formatCategoryName(category).toLowerCase()} news articles found.
            </p>
            <div className="space-x-4">
              <motion.button
                onClick={fetchNewsData}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </motion.button>
              <Link
                to="/home"
                className="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.08),_transparent_50%)] -z-40"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(168,85,247,0.08),_transparent_50%)] -z-30"></div>
      
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-24 pb-12">
        {/* Hero Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <Link
              to="/home"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
              {formatCategoryName(category)}
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Latest {formatCategoryName(category)} news with AI-Powered Fact Checking
            </p>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Filter className="w-4 h-4 mr-2" />
              Showing: {formatCategoryName(category)} ({newsData.length} articles)
            </span>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {currentNews.map((news, index) => (
              <NewsCard
                key={`news-${indexOfFirstNews + index}`}
                news={news}
                index={indexOfFirstNews + index}
              />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && <Pagination />}

          {/* Statistics Section */}
          <motion.div
            className="mt-16 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 shadow-2xl"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {formatCategoryName(category)} News Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <div className="text-3xl font-bold text-blue-300 mb-2">{newsData.length}</div>
                <div className="text-gray-300">Total Articles</div>
              </div>
              <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30">
                <div className="text-3xl font-bold text-green-300 mb-2">
                  {newsData.filter((news) => news.prediction === true).length}
                </div>
                <div className="text-gray-300">Real News</div>
              </div>
              <div className="text-center p-6 bg-red-500/20 rounded-xl border border-red-500/30">
                <div className="text-3xl font-bold text-red-300 mb-2">
                  {newsData.filter((news) => news.prediction === false).length}
                </div>
                <div className="text-gray-300">Fake News</div>
              </div>
            </div>
          </motion.div>

          {/* Page Info */}
          <motion.div
            className="mt-8 text-center text-gray-400"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <p>
              Showing {indexOfFirstNews + 1} to {Math.min(indexOfLastNews, newsData.length)} of {newsData.length} articles
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNews;
