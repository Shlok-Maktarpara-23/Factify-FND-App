import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, HelpCircle, MessageSquare, Send, X } from 'lucide-react';
import axios from 'axios';

const NewsFeedback = ({ newsId, newsTitle, prediction, onFeedbackSubmit, userFeedback, feedbackCount }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [permanentFeedback, setPermanentFeedback] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID from token
  const getCurrentUserId = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return null;
      
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      return tokenPayload.user_id || tokenPayload.sub || tokenPayload.id || null;
    } catch (error) {
      console.error('Error parsing token for user ID:', error);
      return null;
    }
  };

  // Check localStorage for permanent feedback storage (user-specific)
  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);
    
    if (!userId) {
      setPermanentFeedback(null);
      return;
    }

    // Create user-specific feedback key
    const feedbackKey = `feedback_${userId}_${newsId}`;
    const storedFeedback = localStorage.getItem(feedbackKey);
    
    if (storedFeedback) {
      try {
        const parsedFeedback = JSON.parse(storedFeedback);
        setPermanentFeedback(parsedFeedback);
      } catch (error) {
        console.error('Error parsing stored feedback:', error);
        localStorage.removeItem(feedbackKey);
      }
    } else if (userFeedback) {
      localStorage.setItem(feedbackKey, JSON.stringify(userFeedback));
      setPermanentFeedback(userFeedback);
    } else {
      setPermanentFeedback(null);
    }
  }, [newsId, userFeedback]);

  useEffect(() => {
    const userId = getCurrentUserId();
    
    if (currentUserId && userId !== currentUserId) {
      setPermanentFeedback(null);
      setSubmittedFeedback(null);
    }
    
    setCurrentUserId(userId);
  }, []);

  // Initialize submittedFeedback from userFeedback if available
  useEffect(() => {
    if (userFeedback && !submittedFeedback) {
      setSubmittedFeedback(userFeedback);
    }
  }, [userFeedback, submittedFeedback]);

  const feedbackOptions = [
    {
      value: 'correct',
      label: 'Correct Prediction',
      icon: ThumbsUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      value: 'incorrect',
      label: 'Incorrect Prediction',
      icon: ThumbsDown,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    {
      value: 'unsure',
      label: 'Not Sure',
      icon: HelpCircle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    }
  ];

  const handleFeedbackSubmit = async () => {
    if (!feedbackType) {
      setError('Please select a feedback type');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get the access token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('Please log in to submit feedback.');
        setIsSubmitting(false);
        return;
      }

      // Get current user ID
      const userId = getCurrentUserId();
      if (!userId) {
        setError('Unable to identify user. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      // Check if token is expired or invalid
      try {
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        if (Date.now() > tokenPayload.exp * 1000) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('accessToken');
          setIsSubmitting(false);
          return;
        }
      } catch (tokenError) {
        console.error('Error parsing token:', tokenError);
        setError('Invalid authentication token. Please log in again.');
        localStorage.removeItem('accessToken');
        setIsSubmitting(false);
        return;
      }
      
      const response = await axios.post('http://127.0.0.1:8000/api/news/feedback/', {
        news: newsId,
        feedback_type: feedbackType,
        user_comment: userComment.trim() || null
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Feedback submitted successfully:', response.data);

      // Create feedback object with current timestamp 
      const feedbackData = {
        ...response.data,
        feedback_type: feedbackType,
        user_comment: userComment.trim() || null,
        created_at: response.data.created_at || new Date().toISOString(),
        user_id: userId 
      };

      // Store the submitted feedback in localStorage for persistence (user-specific)
      const feedbackKey = `feedback_${userId}_${newsId}`;
      localStorage.setItem(feedbackKey, JSON.stringify(feedbackData));
      
      // Update states
      setSubmittedFeedback(feedbackData);
      setPermanentFeedback(feedbackData);
      
      // Show thank you message
      setShowThankYou(true);
      
      // Call parent callback to update UI
      onFeedbackSubmit(feedbackData);
      
      // Reset form
      setFeedbackType('');
      setUserComment('');
      setShowFeedbackForm(false);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('accessToken');
      } else if (error.response?.status === 400) {
        // Check if it's a duplicate feedback error
        const errorMessage = error.response?.data?.error || error.response?.data?.message || '';
        if (errorMessage.toLowerCase().includes('already') || 
            errorMessage.toLowerCase().includes('duplicate') ||
            errorMessage.toLowerCase().includes('feedback')) {
          setError('You already gave feedback for this news.');
        } else {
          setError('You already gave feedback for this news.');
        }
      } else if (error.response?.status === 403) {
        setError('You are not authorized to perform this action.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Failed to submit feedback. Status: ${error.response?.status || 'Unknown'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackIcon = (type) => {
    const option = feedbackOptions.find(opt => opt.value === type);
    if (option) {
      const Icon = option.icon;
      return <Icon className={`w-4 h-4 ${option.color}`} />;
    }
    return null;
  };

  const getFeedbackLabel = (type) => {
    const option = feedbackOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return null; // Return null instead of 'Date not available'
    }
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return null; // Return null for invalid dates
      }
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return null; // Return null on error
    }
  };

  // Only show feedback if current user matches the feedback user (or if no user-specific data)
  const getCurrentUserFeedback = () => {
    const userId = getCurrentUserId();
    if (!userId) return null;

    // Check if permanent feedback belongs to current user
    if (permanentFeedback && permanentFeedback.user_id === userId) {
      return permanentFeedback;
    }

    // Check if submitted feedback belongs to current user
    if (submittedFeedback && submittedFeedback.user_id === userId) {
      return submittedFeedback;
    }

    // Check if userFeedback belongs to current user (this should come from server)
    if (userFeedback) {
      return userFeedback;
    }

    return null;
  };

  const activeFeedback = getCurrentUserFeedback();

  // If current user already gave feedback, show their feedback
  if (activeFeedback) {
    const formattedDate = formatDate(activeFeedback.created_at);
    
    return (
      <div className="mt-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getFeedbackIcon(activeFeedback.feedback_type)}
            <span className="text-sm text-gray-300">
              Your feedback: {getFeedbackLabel(activeFeedback.feedback_type)}
            </span>
          </div>
          {/* Only show date if it's available */}
          {formattedDate && (
            <span className="text-xs text-gray-400">
              {formattedDate}
            </span>
          )}
        </div>
        {activeFeedback.user_comment && (
          <p className="text-sm text-gray-400 italic">
            "{activeFeedback.user_comment}"
          </p>
        )}
        <div className="mt-2 text-xs text-gray-500">
          Total feedbacks: {feedbackCount || 0}
        </div>
        <div className="mt-2 text-xs text-blue-400">
          ✓ You already gave feedback
        </div>
      </div>
    );
  }

  // Thank you message modal
  if (showThankYou) {
    return (
      <div className="mt-3 p-3 bg-green-700/30 rounded-lg border border-green-600/50">
        <div className="text-center">
          <div className="text-green-400 text-lg mb-2">🎉</div>
          <h4 className="text-sm font-semibold text-green-300 mb-2">Thank You!</h4>
          <p className="text-xs text-green-200 mb-3">
            Your feedback has been submitted successfully. 
            It helps us improve our AI model's accuracy.
          </p>
          <button
            onClick={() => setShowThankYou(false)}
            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {/* Feedback Button */}
      <button
        onClick={() => setShowFeedbackForm(true)}
        className="flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-500/10"
      >
        <MessageSquare className="w-3 h-3" />
        <span>Give Feedback</span>
        {feedbackCount > 0 && (
          <span className="bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full text-xs">
            {feedbackCount}
          </span>
        )}
      </button>

      {/* Feedback Form Modal */}
      <AnimatePresence>
        {showFeedbackForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowFeedbackForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 border border-gray-600 rounded-xl p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto feedback-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">News Feedback</h3>
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* News Info - More Compact */}
              <div className="mb-3 p-2 bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-300 mb-1 line-clamp-2">
                  <span className="font-medium">News:</span> {newsTitle}
                </p>
                <p className="text-xs text-gray-300">
                  <span className="font-medium">AI Prediction:</span>{' '}
                  <span className={prediction ? 'text-green-400' : 'text-red-400'}>
                    {prediction ? 'Real News' : 'Fake News'}
                  </span>
                </p>
              </div>

              {/* Feedback Type Selection - More Compact */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  How accurate was this prediction? *
                </label>
                <div className="space-y-1">
                  {feedbackOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                          feedbackType === option.value
                            ? `${option.bgColor} ${option.borderColor}`
                            : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="feedbackType"
                          value={option.value}
                          checked={feedbackType === option.value}
                          onChange={(e) => setFeedbackType(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className={`w-4 h-4 ${option.color}`} />
                        <span className="text-sm text-gray-200">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Comment Field - More Compact */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Additional Comment (Optional)
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  rows="2"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              {/* Submit Button - More Compact */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="flex-1 px-3 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmitting || !feedbackType}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsFeedback;
