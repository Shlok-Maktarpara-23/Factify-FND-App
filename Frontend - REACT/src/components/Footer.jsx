import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  return (
    <motion.footer
      className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-t border-gray-600/50"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-300 no-underline"
              style={{ textDecoration: "none" }}
            >
              <CheckCircle className="w-8 h-8 text-gray-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Factify - FND
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI-powered fact checking solution that helps you identify fake news and misinformation with 99.5% accuracy.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                variants={linkVariants}
                whileHover="hover"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                variants={linkVariants}
                whileHover="hover"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                variants={linkVariants}
                whileHover="hover"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                variants={linkVariants}
                whileHover="hover"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    Home
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/checkbytitle"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    Check News by Title
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/newsquiz"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    News Quiz
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    About Us
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Categories</h3>
            <ul className="space-y-2">
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/category/politics"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    Politics
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/category/technology"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    Technology
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/category/sports"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    Sports
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link
                    to="/category/business"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    Business
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">contact@factify-fnd.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600/50 mt-5 pt-5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Factify - FND. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Privacy Policy
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Terms of Service
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  to="/support"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Support
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
