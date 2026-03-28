import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, HelpCircle, MessageSquare, TrendingUp, BarChart3 } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

const FeedbackDashboard = () => {
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Factify - FND | Feedback Dashboard";
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      
      // Get the access token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('Please log in to view your feedback dashboard.');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const [summaryResponse, feedbacksResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/news/feedback/feedback_summary/', { headers }),
        axios.get('http://127.0.0.1:8000/api/news/feedback/my_feedbacks/', { headers })
      ]);

      setFeedbackSummary(summaryResponse.data);
      setUserFeedbacks(feedbacksResponse.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      if (error.response?.status === 401) {
        setError('Please log in to view your feedback dashboard.');
      } else {
        setError('Failed to load feedback data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'correct':
        return <ThumbsUp className="w-5 h-5 text-green-400" />;
      case 'incorrect':
        return <ThumbsDown className="w-5 h-5 text-red-400" />;
      case 'unsure':
        return <HelpCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-400" />;
    }
  };

  const getFeedbackLabel = (type) => {
    switch (type) {
      case 'correct':
        return 'Correct Prediction';
      case 'incorrect':
        return 'Incorrect Prediction';
      case 'unsure':
        return 'Not Sure';
      default:
        return type;
    }
  };

  const getFeedbackColor = (type) => {
    switch (type) {
      case 'correct':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'incorrect':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'unsure':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
        <div className="text-center">
          <div className="animate-spin h-16 w-16 text-blue-400 mx-auto mb-4 border-4 border-blue-400/30 border-t-blue-400 rounded-full"></div>
          <p className="text-gray-200 text-lg">Loading feedback data...</p>
        </div>
      </div>
    );
  }

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
            onClick={fetchFeedbackData}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.08),_transparent_50%)] -z-40"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(168,85,247,0.08),_transparent_50%)] -z-30"></div>
      
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
              Feedback Dashboard
            </h1>
            <p className="text-xl text-gray-200">
              Track your contributions to improving news accuracy
            </p>
          </motion.div>

          {/* Summary Cards */}
          {feedbackSummary && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{feedbackSummary.total_feedbacks}</div>
                <div className="text-gray-300">Total Feedbacks</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{feedbackSummary.correct_predictions}</div>
                <div className="text-gray-300">Correct Predictions</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{feedbackSummary.incorrect_predictions}</div>
                <div className="text-gray-300">Incorrect Predictions</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{feedbackSummary.unsure}</div>
                <div className="text-gray-300">Not Sure</div>
              </div>
            </motion.div>
          )}

          {/* Feedback History */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
                Your Feedback History
              </h2>
              <div className="text-sm text-gray-400">
                {userFeedbacks.length} feedback{userFeedbacks.length !== 1 ? 's' : ''}
              </div>
            </div>

            {userFeedbacks.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Feedback Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start contributing by giving feedback on news articles you read.
                </p>
                <motion.button
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse News
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {userFeedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    className={`p-4 rounded-lg border ${getFeedbackColor(feedback.feedback_type)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getFeedbackIcon(feedback.feedback_type)}
                          <span className="font-medium">{getFeedbackLabel(feedback.feedback_type)}</span>
                          <span className="text-xs opacity-75">
                            {formatDate(feedback.created_at)}
                          </span>
                        </div>
                        
                        <h4 className="font-medium mb-2 line-clamp-2">
                          {feedback.news_title}
                        </h4>
                        
                        {feedback.user_comment && (
                          <p className="text-sm opacity-90 italic">
                            "{feedback.user_comment}"
                          </p>
                        )}
                        
                        <div className="mt-2 text-xs opacity-75">
                          AI predicted: <span className={feedback.prediction ? 'text-green-400' : 'text-red-400'}>
                            {feedback.prediction ? 'Real News' : 'Fake News'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Impact Section */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8">
              <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Your Impact</h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Every piece of feedback you provide helps improve our AI model's accuracy. 
                Your contributions make a real difference in fighting misinformation and 
                promoting reliable news sources.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
