import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../axios Instance/axiosInstance";
import axios from "axios";
import { Calendar, Globe, Clock, CheckCircle, X, Loader2 } from "lucide-react";;
import Navbar from "@/components/Navbar";
import NewsFeedback from "@/components/NewsFeedback";

const Home_Page = () => {
  const [liveNewsData, setLiveNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const currentScrollPosition = useRef(0);

  // Set document title
  useEffect(() => {
    document.title = "Factify | Home";
  }, []);

  // Protected data fetch
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        await axiosInstance("/protected-view/");
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };
    fetchProtectedData();
  }, []);

  // Save scroll position before fetching new data
  const saveScrollPosition = () => {
    currentScrollPosition.current = window.scrollY;
  };

  // Restore scroll position after data update
  const restoreScrollPosition = () => {
    setTimeout(() => {
      window.scrollTo(0, currentScrollPosition.current);
    }, 100);
  };

  // Function to fetch live news data
  const fetchLiveNewsData = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
      setError(null);
    } else {
      saveScrollPosition();
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/news/live");
      setLiveNewsData(response.data);
      setLastUpdated(new Date());
      setError(null);
      
      if (!isInitial) {
        restoreScrollPosition();
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to fetch news data");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and interval setup
  useEffect(() => {
    fetchLiveNewsData(true);

    // Update every 2 minutes 
    const intervalId = setInterval(() => {
      fetchLiveNewsData(false);
    }, 120000); // 2 minutes

    return () => clearInterval(intervalId);
  }, []);

  // Format date function
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

  // News Card Component
  const NewsCard = ({ news, index, featured = false }) => {
    const [userFeedback, setUserFeedback] = useState(news.user_feedback);
    const [feedbackCount, setFeedbackCount] = useState(news.feedback_count || 0);

    const handleFeedbackSubmit = (feedbackData) => {
      setUserFeedback(feedbackData);
      setFeedbackCount(prev => prev + 1);
    };

    return (
      <motion.div
        className={`bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden hover:border-gray-500/50 group ${
          featured ? "col-span-1" : ""
        }`}
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -5 }}
      >
        {/* Image Section */}
        {news.img_url && news.img_url !== "None" && (
          <div className={`${featured ? "h-64" : "h-56"} overflow-hidden relative`}>
            <img
              src={news.img_url}
              alt={`News ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
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

            {/* Title - Full display  */}
            <h3 className={`${featured ? "text-xl" : "text-lg"} font-bold text-white leading-tight hover:text-blue-300 cursor-pointer transition-colors min-h-[4rem]`}>
              {news.title}
            </h3>

            {/* Section Name */}
            {news.section_name && (
              <p className="text-sm text-gray-300">
                <span className="font-medium">Section:</span> {news.section_name}
              </p>
            )}
          </div>

          {/* Footer Section  */}
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
            <NewsFeedback
              newsId={news.id}
              newsTitle={news.title}
              prediction={news.prediction}
              onFeedbackSubmit={handleFeedbackSubmit}
              userFeedback={userFeedback}
              feedbackCount={feedbackCount}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-200 text-lg">Loading latest news...</p>
        </div>
      </div>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6">
            <h3 className="font-bold mb-2">Error!</h3>
            <p>{error}</p>
          </div>
          <motion.button
            onClick={() => fetchLiveNewsData(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  // No Data Component
  if (liveNewsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-6">📰</div>
          <h2 className="text-2xl font-bold text-white mb-4">No News Available</h2>
          <p className="text-gray-300 mb-6">There are no news articles to display at the moment.</p>
          <motion.button
            onClick={() => fetchLiveNewsData(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh
          </motion.button>
        </div>
      </div>
    );
  }

  // Data organization
  const featuredNews = liveNewsData.slice(0, 2); // 2 featured news
  const latestNews = liveNewsData.slice(2, 8);   // 6 latest news
  const moreNews = liveNewsData.slice(8, 20);    // 12 more news

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.08),_transparent_50%)] -z-40"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(168,85,247,0.08),_transparent_50%)] -z-30"></div>
      
      <Navbar />
      
      <div className="pt-24 pb-12">
        {/* Hero Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
              Factify
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Real-time News with AI-Powered Fact Checking
            </p>
            <div className="flex items-center justify-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                Updated every 2 minutes • Last updated: {lastUpdated ? formatDate(lastUpdated) : 'Loading...'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* News Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Featured News Section - 2 news in 1 row */}
          {featuredNews.length > 0 && (
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-3xl font-bold text-white mb-8 border-b-2 border-blue-500 pb-3 inline-block"
                variants={fadeInUp}
              >
                Featured News
              </motion.h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.map((news, index) => (
                  <NewsCard
                    key={`featured-${index}`}
                    news={news}
                    index={index}
                    featured={true}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Latest News Section - 6 news, 3 per row */}
          {latestNews.length > 0 && (
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-3xl font-bold text-white mb-8 border-b-2 border-gray-500 pb-3 inline-block"
                variants={fadeInUp}
              >
                Latest News
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestNews.map((news, index) => (
                  <NewsCard
                    key={`latest-${index}`}
                    news={news}
                    index={index + 2}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* More News Section - 12 news, 3 per row */}
          {moreNews.length > 0 && (
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-3xl font-bold text-white mb-8 border-b-2 border-gray-500 pb-3 inline-block"
                variants={fadeInUp}
              >
                More News
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moreNews.map((news, index) => (
                  <NewsCard
                    key={`more-${index}`}
                    news={news}
                    index={index + 8}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Statistics Section */}
          {liveNewsData.length > 0 && (
            <motion.section
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 shadow-2xl"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">News Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-300 mb-2">{liveNewsData.length}</div>
                  <div className="text-gray-300">Total Articles</div>
                </div>
                <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30">
                  <div className="text-3xl font-bold text-green-300 mb-2">
                    {liveNewsData.filter((news) => news.prediction === true).length}
                  </div>
                  <div className="text-gray-300">Real News</div>
                </div>
                <div className="text-center p-6 bg-red-500/20 rounded-xl border border-red-500/30">
                  <div className="text-3xl font-bold text-red-300 mb-2">
                    {liveNewsData.filter((news) => news.prediction === false).length}
                  </div>
                  <div className="text-gray-300">Fake News</div>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home_Page;
