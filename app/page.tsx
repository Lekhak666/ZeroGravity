"use client";

import Wallet from "./components/Wallet";
import TxForm from "./components/TxForm";
import TxStatus from "./components/TxStatus";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4">
      
      <div className="relative w-full max-w-xl">
        
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl shadow-purple-500/10"
        >
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Private Relay
            </h1>
            <p className="text-sm text-gray-300">
              MEV-resistant transaction layer
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            <Wallet />
            <TxForm />
            <TxStatus />
          </div>

        </motion.div>

      </div>
    </main>
  );
}