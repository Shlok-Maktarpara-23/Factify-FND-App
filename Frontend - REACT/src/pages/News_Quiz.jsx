import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  X,
  Loader2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Navbar from "@/components/Navbar";
import styles from "@/assets/css/NewsQuiz.module.css"; // Import CSS module

const NewsQuiz = () => {
  document.title = "Factify - FND | News Quiz";
  const stage = 3;

  const quizData = {
    id: null,
    news_title: "",
    news_description: "",
    label: null,
  };

  const [newsForQuiz, setNewsForQuiz] = useState(quizData);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    setLoading(true);
    setError("");
    setShowResult("");
    setSelectedAnswer("");

    try {
      const response = await Axios.get("http://127.0.0.1:8000/api/news/quiz/");
      setNewsForQuiz(response.data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (value) => {
    setSelectedAnswer(value);
  };

  const checkAnswer = () => {
    if (selectedAnswer === "") {
      setError("Please select an answer!");
      return;
    }

    setError("");
    const isCorrect =
      (newsForQuiz.label === true && selectedAnswer === "True") ||
      (newsForQuiz.label === false && selectedAnswer === "False");

    if (isCorrect) {
      setShowResult("correct");
      setScore((prev) => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
      }));
    } else {
      setShowResult("incorrect");
      setScore((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const getNewQuiz = () => {
    fetchQuizData();
  };

  return (
    <div className={styles.container}>
      <Navbar activeContainer={stage} />

      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <motion.div className="text-center mb-8">
          <Link
            to="/home"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <h1 className={styles.title}>News Quiz Challenge</h1>
          <p className={styles.questionText}>Test your ability to identify real vs fake news</p>

          {score.total > 0 && (
            <motion.div className="inline-flex items-center px-4 py-2 bg-gray-900 rounded-full text-white">
              <span className="text-lg font-semibold">
                Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
              </span>
            </motion.div>
          )}
        </motion.div>

        {loading ? (
          <motion.div className={styles.card}>
            <div className="text-center">
              <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-400" />
              <p className={styles.questionText}>Loading quiz question...</p>
            </div>
          </motion.div>
        ) : error && !newsForQuiz.news_title ? (
          <motion.div className={styles.card}>
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Quiz</h3>
              <p className="text-gray-200 mb-6">{error}</p>
              <motion.button
                onClick={fetchQuizData}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div className={styles.card}>
            {/* Quiz Question */}
            <motion.div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                {newsForQuiz.news_title}
              </h2>
              <div className="bg-gray-900 border-2 border-gray-400 rounded-xl p-6">
                <p className={styles.questionText}>{newsForQuiz.news_description}</p>
              </div>
            </motion.div>

            {/* Answer Options */}
            <motion.div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Is this news real or fake?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.label
                  className={`flex items-center p-6 border-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedAnswer === "True"
                      ? "border-green-400 bg-green-600 shadow-lg"
                      : "border-gray-400 bg-gray-700 hover:border-green-400 hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    value="True"
                    checked={selectedAnswer === "True"}
                    onChange={() => handleOptionChange("True")}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-4 mr-4 flex items-center justify-center ${
                    selectedAnswer === "True" ? "border-white bg-white" : "border-gray-300"
                  }`}>
                    {selectedAnswer === "True" && (
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                    <span className={styles.optionButton}>Real News</span>
                  </div>
                </motion.label>

                <motion.label
                  className={`flex items-center p-6 border-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedAnswer === "False"
                      ? "border-red-400 bg-red-600 shadow-lg"
                      : "border-gray-400 bg-gray-700 hover:border-red-400 hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    value="False"
                    checked={selectedAnswer === "False"}
                    onChange={() => handleOptionChange("False")}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-4 mr-4 flex items-center justify-center ${
                    selectedAnswer === "False" ? "border-white bg-white" : "border-gray-300"
                  }`}>
                    {selectedAnswer === "False" && (
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <X className="w-8 h-8 text-red-400 mr-3" />
                    <span className={styles.optionButton}>Fake News</span>
                  </div>
                </motion.label>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div className="mb-6 bg-red-700 border-2 border-red-400 rounded-xl p-4 text-center text-white font-semibold">
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Display */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  className={`mb-6 border-4 rounded-xl p-6 text-center ${
                    showResult === "correct"
                      ? "bg-green-700 border-green-400"
                      : "bg-red-700 border-red-400"
                  } text-white font-bold`}
                >
                  {showResult === "correct" ? (
                    <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
                  ) : (
                    <X className="w-16 h-16 text-white mx-auto mb-3" />
                  )}
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {showResult === "correct" ? "Correct!" : "Incorrect!"}
                  </h3>
                  <p className="text-white font-medium text-lg">
                    {showResult === "correct"
                      ? "Great job! You correctly identified this news."
                      : `Wrong answer! This news is actually ${newsForQuiz.label ? "real" : "fake"}.`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!showResult ? (
                <motion.button
                  onClick={checkAnswer}
                  disabled={!selectedAnswer}
                  className="flex items-center justify-center py-4 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg rounded-xl shadow-lg border-2 border-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </motion.button>
              ) : (
                <motion.button
                  onClick={getNewQuiz}
                  className="flex items-center justify-center py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg border-2 border-blue-400 transition-all duration-300"
                >
                  <RefreshCw className="w-6 h-6 mr-2" />
                  Next Question
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewsQuiz;
