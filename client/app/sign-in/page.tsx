"use client";
import { useState } from "react";
import { auth, firebaseAuth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, MoveRight } from "lucide-react";
import Navbar from "../components/Navbar";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err) {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await firebaseAuth.signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      setError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      {/* EcoCarb Branding */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-6xl font-bold text-lime-500 text-center py-8"
      >
        EcoCarb!
      </motion.h1>

      {/* Sign-In Form */}
      <div className="flex flex-grow items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6"
        >
          <h2 className="text-3xl font-bold text-center">Welcome Back 👋</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <motion.form
            onSubmit={handleSignIn}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-800 text-white rounded-md px-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-gray-800 text-white rounded-md px-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Sign-In Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
              Sign In
            </motion.button>
          </motion.form>

          {/* OR Divider */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-full border-t border-gray-700"></span>
            <span className="text-sm text-gray-400">or</span>
            <span className="w-full border-t border-gray-700"></span>
          </div>

          {/* Google Sign-In Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <MoveRight size={18} />}
            Sign In with Google
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
