"use client";
import React from "react";
import { motion } from "framer-motion";
import Squares from "./Squares";


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Hero: React.FC = () => {

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      <div className="relative h-[85vh] overflow-hidden">
        <Squares speed={0.3} squareSize={40} direction="diagonal" borderColor="rgba(255, 255, 255, 0.1)" hoverFillColor="#0096FF" />
        <main className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center mt-[-80px]">

        <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="text-4xl md:text-6xl font-extrabold text-lime-500 tracking-tight drop-shadow-lg">
            Welcome to
          </motion.h1>
          <motion.h2 variants={fadeInUp} initial="hidden" animate="visible" className="text-3xl md:text-5xl font-bold text-white mt-4">
            EcoCarb
          </motion.h2>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-sm md:text-base text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
          Drive Smart, Breathe Clean: AI-Powered Insights for a Greener Tomorrow.
          </motion.p>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-10">
            <button aria-label="View Latest Events" className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-gray-500 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 hover:text-white">
              <a href="/sign-in">Explore!</a>
            </button>
          </motion.div>
        </main>
        
      </div>

    </div>
  );
};

export default Hero;