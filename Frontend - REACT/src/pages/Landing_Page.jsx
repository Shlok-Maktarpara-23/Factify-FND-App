import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Search,
  Filter,
  FileText,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
  Zap,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Content Data
const content = {
  hero: {
    headline: "Fight Fake News with AI in Seconds",
    description:
      "Our ML-powered app analyzes news articles, detects misinformation, and helps you stay informed with confidence.",
    ctaPrimary: "Get Started",
    ctaSecondary: "See How It Works",
  },
  features: [
    {
      icon: Search,
      title: "AI-Powered Detection",
      description:
        "Instantly classify news as Real or Fake using advanced machine learning algorithms.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Filter,
      title: "Filter by Category",
      description:
        "Browse and analyze news by categories like Politics, Sports, Tech, and more.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FileText,
      title: "Title Checker",
      description:
        "Verify if a news headline alone is real or fake with our smart title analysis.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Interactive Quiz",
      description:
        "Test your ability to spot fake news with our engaging quiz feature.",
      color: "from-orange-500 to-orange-600",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Fetch News",
      description:
        "Gather articles from trusted sources or analyze your own content.",
      icon: Search,
    },
    {
      step: 2,
      title: "AI Analysis",
      description:
        "Our ML model checks credibility and classifies the content.",
      icon: Zap,
    },
    {
      step: 3,
      title: "Get Results",
      description: "View clear Real/Fake labels with confidence scores.",
      icon: Shield,
    },
  ],
  testimonials: [
    {
      name: "Rahul",
      role: "Student",
      content: "Quick and reliable – helped me verify news instantly!",
      avatar: "R",
      rating: 5,
    },
    {
      name: "Priya",
      role: "Researcher",
      content: "I love the quiz feature, very engaging!",
      avatar: "P",
      rating: 5,
    },
    {
      name: "Ankit",
      role: "Developer",
      content: "The category filter makes browsing so easy.",
      avatar: "A",
      rating: 5,
    },
  ],
};

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// AnimatedSection Component
const AnimatedSection = ({ children, variants = fadeInUp, className = "" }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hero Section Component 
const HeroSection = () => (
  <section className="p-5 relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1),_transparent_70%)]"></div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
        {/* Left Side - Content */}
        <div className="flex flex-col justify-center space-y-8 lg:pr-8">
          <AnimatedSection variants={fadeInUp}>
            <motion.div
              className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3 mb-6 w-fit"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="text-gray-200 text-sm font-medium">
                AI-Powered Fact Checking
              </span>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
              {content.hero.headline}
            </h1>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              {content.hero.description}
            </p>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl border border-blue-500/50 hover:border-blue-400 transition-all duration-300 gap-3 min-w-[180px] no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection variants={fadeInUp}>
            <div className="flex items-center gap-6 pt-6 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">
                  Real-time Analysis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">99.5% Accuracy</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Right Side - Image */}
        <div className="flex items-center justify-center lg:justify-end">
          <AnimatedSection variants={fadeInUp}>
            <motion.div
              className="relative max-w-xl w-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-lg"></div>

              <motion.div
                className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/b8445e06-723c-45c8-ba75-2d7e0cac0648.png"
                  alt="Digital verification and AI-powered fact checking illustration"
                  className="w-full h-auto rounded-xl shadow-lg"
                  loading="lazy"
                />

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-2 shadow-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">1M+</div>
                    <div className="text-xs text-gray-400">
                      Articles Verified
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -top-4 -right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-lg px-4 py-2 shadow-xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      99.5%
                    </div>
                    <div className="text-xs text-gray-400">Accuracy Rate</div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute top-12 -right-8 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <motion.div
                className="absolute -bottom-8 -left-6 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              />
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </div>

    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    ></motion.div>
  </section>
);

// Feature Card Component
const FeatureCard = ({ feature, index }) => {
  const IconComponent = feature.icon;

  return (
    <AnimatedSection
      variants={index % 2 === 0 ? slideRight : slideLeft}
      className="h-full"
    >
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full hover:bg-gray-700/50 transition-all duration-300 shadow-xl hover:shadow-2xl"
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
        >
          <IconComponent className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
      </motion.div>
    </AnimatedSection>
  );
};

// Features Section Component
const FeaturesSection = () => (
  <section className="py-10 bg-gradient-to-b from-slate-900 to-gray-900">
    <div className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection variants={fadeInUp}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced AI technology meets intuitive design to deliver accurate
            fake news detection
          </p>
        </div>
      </AnimatedSection>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {content.features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </motion.div>
    </div>
  </section>
);

// How It Works Section Component
const HowItWorksSection = () => (
  <section className="p-10 bg-gradient-to-b from-gray-900 to-slate-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection variants={fadeInUp}>
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Simple 3-step process to verify any news article
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto  border-gray-600 rounded-lg p-5">
        <div className="space-y-10">
          {content.howItWorks.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <AnimatedSection
                key={index}
                variants={index % 2 === 0 ? slideRight : slideLeft}
              >
                <motion.div
                  className="flex border-2 border-gray-700/60 hover:bg-gray-800/50 rounded-2xl p-6 flex-col md:flex-row items-center gap-8"
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`flex-shrink-0 ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center mt-4">
                      <span className="text-4xl font-bold text-blue-400">
                        0{step.step}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex-1 text-center md:text-left ${
                      index % 2 === 1 ? "md:order-1" : ""
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => (
  <motion.div
    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full shadow-xl"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div className="flex items-center mb-6">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>

    <Quote className="w-8 h-8 text-blue-400 mb-4" />

    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
      "{testimonial.content}"
    </p>

    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
        {testimonial.avatar}
      </div>
      <div>
        <h4 className="text-white font-semibold">{testimonial.name}</h4>
        <p className="text-gray-400 text-sm">{testimonial.role}</p>
      </div>
    </div>
  </motion.div>
);

// Testimonials Section Component
const TestimonialsSection = () => (
  <section className="py-8 bg-gradient-to-b from-slate-900 to-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection variants={fadeInUp}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Users Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trusted by thousands of users worldwide
          </p>
        </div>
      </AnimatedSection>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-5"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {content.testimonials.map((testimonial, index) => (
          <AnimatedSection key={index} variants={fadeInUp}>
            <TestimonialCard testimonial={testimonial} />
          </AnimatedSection>
        ))}
      </motion.div>
    </div>
  </section>
);

// CTA Section Component
const CTASection = () => (
  <section className="py-25 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection variants={fadeInUp}>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Fight Fake News?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of users who trust our AI to verify news accuracy
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-xl shadow-2xl border border-blue-500/50 hover:border-blue-400 transition-all duration-300 inline-flex items-center gap-3 no-underline"
              style={{ textDecoration: "none" }}
            >
              Try Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);


// Main Landing Page Component
const Landing_Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white ">
      {/* Fixed Background Layer - Covers entire viewport including scroll areas */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 -z-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.08),_transparent_50%)] -z-40"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(168,85,247,0.08),_transparent_50%)] -z-30"></div>

      <Header />

      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default Landing_Page;
