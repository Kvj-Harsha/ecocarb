"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import Navbar from "../components/Navbar";

const developers = [
  {
    name: "K V Jaya Harsha",
    linkedin: "https://linkedin.com/in/kvjharsha/",
    github: "https://github.com/kvj-harsha",
    email: "mailto:cs23b1034@iiitr.ac.in",
    photo: "members/harsha.png",
    batch: "CSE 2023",
  },
  {
    name: "Y Santhosh",
    linkedin: "https://www.linkedin.com/in/santhosh-yanamadni-801b56299",
    github: "https://github.com/Y-Santhosh",
    email: "mailto:ad23b1060@iiitr.ac.in",
    photo: "members/santhosh.png",
    batch: "AI & DS 2023",
  },
  {
    name: "Abhishek Buddiga",
    linkedin: "https://www.linkedin.com/in/abhishek-buddiga-bb5a0b2b8/",
    github: "https://github.com/ad23b1012",
    email: "mailto:ad23b1012@iiitr.ac.in",
    photo: "members/abhishek.png",
    batch: "AI & DS 2023",
  },
  {
    name: "P Charukesh",
    linkedin: "https://www.linkedin.com/in/pyla-charukesh-937aa02b7/",
    github: "https://github.com/Charukesh-pyla",
    email: "mailto:ad23b1043@iiitr.ac.in",
    photo: "members/charukesh.png",
    batch: "AI & DS 2023",
  },
  {
    name: "P Dhanush",
    linkedin: "https://www.linkedin.com/in/dhanush-pachabhatla-349232332/?trk=opento_sprofile_details",
    github: "https://github.com/dhanushpachabhatla",
    email: "mailto:ad23b1053@iiitr.ac.in",
    photo: "members/dhanush.jpg",
    batch: "CSE 2023",
  },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-lime-500 tracking-tight drop-shadow-lg mb-8">
          Meet the Team
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="bg-gray-900 p-6 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:border hover:border-lime-500"
            >
              <img
                src={dev.photo}
                alt={`${dev.name}'s profile`}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-[4px] border-lime-500"
              />
              <h2 className="text-2xl font-bold text-center mb-4">{dev.name}</h2>
              <p className="text-center text-gray-400">Batch {dev.batch}</p>
              <div className="flex justify-center space-x-6 mt-4">
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl hover:text-lime-500 transition-transform duration-200"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl hover:text-lime-500 transition-transform duration-200"
                >
                  <FaGithub />
                </a>
                <a
                  href={dev.email}
                  className="text-3xl hover:text-lime-500 transition-transform duration-200"
                >
                  <FaEnvelope />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12">
          <a
            href="https://github.com/Y-Santhosh/ecocarb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-gray-500 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 hover:text-white transition-colors shadow-lg"
          >
            <FaGithub className="mr-2 text-2xl" />
            GitHub Repo!
          </a>
        </div>
      </motion.div>
    </div>
  );
}
