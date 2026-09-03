'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
}

export function LoadingScreen({ 
  message = 'Initializing DunningPilot Recovery Engine...', 
  subtext = 'Authenticating session & establishing payment gateway connections' 
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-6 text-white font-sans select-none">
      
      {/* Deep purple & emerald ambient gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-zinc-950 to-black" />

      {/* Top glowing radial aura */}
      <motion.div 
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"
        animate={{ 
          scale: [0.95, 1.05, 0.95],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[90px] pointer-events-none"
        animate={{ 
          scale: [1.05, 0.95, 1.05],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Main Centered Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md text-center">
        
        {/* Animated Brand Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          {/* Pulsing outer aura ring */}
          <motion.div 
            className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/30 via-emerald-500/40 to-purple-500/30 blur-xl pointer-events-none"
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [0.98, 1.04, 0.98]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
            <BrandLogo size="xl" iconOnly />
          </div>
        </motion.div>

        {/* Brand Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-white">DunningPilot</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider">
              Enterprise AI
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">
            Recover More. Automate Smarter.
          </p>
        </motion.div>

        {/* Progress Bar & Status Indicator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full space-y-4 pt-2"
        >
          <div className="relative w-full bg-zinc-900/90 rounded-full h-2 overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 via-emerald-400 to-cyan-400 h-full rounded-full"
              initial={{ width: '10%' }}
              animate={{ width: ['15%', '65%', '95%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              {message}
            </p>
            <p className="text-[11px] text-zinc-400 font-mono">
              {subtext}
            </p>
          </div>
        </motion.div>

      </div>

      {/* Footer System Status Badge */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 text-[11px] text-zinc-400 font-mono flex items-center gap-3 bg-zinc-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
      >
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Razorpay Sandbox Active
        </span>
        <span className="text-zinc-600">•</span>
        <span className="flex items-center gap-1 text-purple-400">
          <Zap className="w-3 h-3" /> Autonomous Failure Recovery Engine
        </span>
      </motion.div>
    </div>
  );
}