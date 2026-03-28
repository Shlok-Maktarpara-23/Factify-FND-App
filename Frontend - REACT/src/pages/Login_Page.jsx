import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import Header from "@/components/Header";

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
});

const Login_Page = () => {
  const navigate = useNavigate();
  const { setLoggedIn, setUsername } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/login/", {
        email: data.email,
        password: data.password,
      });

      // Save tokens
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);

      // Fetch user info immediately
      const userInfo = await axios.get("http://127.0.0.1:8000/api/user/info/", {
        headers: {
          Authorization: `Bearer ${response.data.tokens.access}`,
        },
      });

      // Update AuthContext instantly
      setLoggedIn(true);
      setUsername(userInfo.data.username);
      setSuccess(true);
      reset();

      console.log("Login successful");
      
      // Redirect to home page after brief success message
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error.response?.data);
      
      if (error.response?.data) {
        // Handle server validation errors
        Object.keys(error.response.data).forEach((key) => {
          if (key in loginSchema.shape) {
            setError(key, {
              type: "server",
              message: Array.isArray(error.response.data[key]) 
                ? error.response.data[key][0] 
                : error.response.data[key]
            });
          } else {
            setServerError(error.response.data[key] || "Invalid credentials. Please try again.");
          }
        });
      } else {
        setServerError("Invalid credentials. Please check your email and password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.08),_transparent_50%)] -z-40"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(168,85,247,0.08),_transparent_50%)] -z-30"></div>
      
      <Header />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <motion.div
          className="max-w-md w-full space-y-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {/* Back to Home Link */}
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Link
              to="/"
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-1 text-gray-300 text-sm">
              Sign in to your Factify - FND account
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-300 text-center text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Login successful! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6 shadow-2xl"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    className="mt-1 text-xs text-red-400"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <motion.p
                    className="mt-1 text-xs text-red-400"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Server Error */}
              {serverError && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-center text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {serverError}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login_Page;
