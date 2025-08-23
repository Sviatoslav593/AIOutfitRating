import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import UploadForm from "../components/UploadForm";
import ResultCard from "../components/ResultCard";
import LoadingCard from "../components/LoadingCard";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle file upload and analysis from UploadForm component
  const handleUpload = (file, analysis) => {
    setUploadedFile(file);
    setAnalysisResult(analysis);
    setIsAnalyzing(false);
    setShowResult(true);
  };

  // Handle upload start (show loading state)
  const handleUploadStart = () => {
    setIsAnalyzing(true);
    setShowResult(false);
  };

  // Reset to initial state
  const handleReset = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setShowResult(false);
    setIsAnalyzing(false);
  };

  return (
    <>
      <Head>
        <title>AI Outfit Rater - Оцінка твого стилю від AI</title>
        <meta
          name="description"
          content="Завантаж свій outfit та дізнайся рейтинг від AI! Сучасна платформа для оцінки стилю."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tiktok-pink/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tiktok-blue/10 rounded-full blur-3xl animate-bounce-slow"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-gradient-tiktok bg-clip-text text-transparent">
                AI Outfit Rater
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Завантаж свій outfit та дізнайся рейтинг від AI! ✨
            </motion.p>

            <motion.p
              className="text-lg text-white/70 mt-2 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Отримай професійну оцінку свого стилю за секунди
            </motion.p>
          </motion.header>

          {/* Main Content Area */}
          <div className="flex flex-col items-center justify-center space-y-8">
            {!showResult && !isAnalyzing ? (
              /* Upload Form Section */
              <motion.section
                key="upload-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-full max-w-md"
              >
                <UploadForm
                  onUpload={handleUpload}
                  onUploadStart={handleUploadStart}
                />
              </motion.section>
            ) : isAnalyzing ? (
              /* Loading Section */
              <motion.section
                key="loading-section"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md"
              >
                <LoadingCard />
              </motion.section>
            ) : (
              /* Result Section */
              <motion.section
                key="result-section"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md space-y-6"
              >
                <ResultCard
                  file={uploadedFile}
                  analysisResult={analysisResult}
                />

                {/* Reset Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="text-center"
                >
                  <motion.button
                    onClick={handleReset}
                    className="bg-white/20 backdrop-blur-sm text-white py-3 px-8 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Rate Another Outfit 🔄
                  </motion.button>
                </motion.div>
              </motion.section>
            )}

            {/* Features Section */}
            {!showResult && !isAnalyzing && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-center mt-16"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {[
                    {
                      icon: "🤖",
                      title: "AI-Powered",
                      desc: "Розумна оцінка стилю",
                    },
                    {
                      icon: "⚡",
                      title: "Instant",
                      desc: "Результат за секунди",
                    },
                    {
                      icon: "📱",
                      title: "Mobile-First",
                      desc: "Зручно на телефоні",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white"
                    >
                      <div className="text-3xl mb-3">{feature.icon}</div>
                      <h3 className="font-bold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 text-sm">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="text-center mt-20 text-white/60"
          >
            <p className="text-sm">Made with ❤️ using AI technology</p>
          </motion.footer>
        </div>
      </main>
    </>
  );
}
