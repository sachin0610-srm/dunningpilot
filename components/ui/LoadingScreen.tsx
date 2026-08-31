'use client';

import React from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
}

export function LoadingScreen({ 
  message = 'Initializing DunningPilot Recovery Engine...', 
  subtext = 'Authenticating session & establishing payment gateway connections' 
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 font-sans relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main Centered Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm text-center">
        
        {/* Animated Brand Shield Icon */}
        <div className="relative">
          {/* Outer Pulsating Ring */}
          <div className="absolute -inset-3 rounded-2xl bg-emerald-500/20 animate-ping duration-1000 opacity-40 pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>

        {/* Brand Name & Version */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl font-extrabold tracking-tight text-zinc-100">DunningPilot</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
              Enterprise
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-medium">Payment Recovery System</p>
        </div>

        {/* Progress Bar & Loader */}
        <div className="w-full space-y-3 pt-2">
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full animate-pulse w-3/4 transition-all duration-500" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              {message}
            </p>
            <p className="text-[11px] text-zinc-400 font-mono">
              {subtext}
            </p>
          </div>
        </div>

      </div>

      {/* Footer System Status */}
      <div className="absolute bottom-8 text-[11px] text-zinc-400 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Razorpay Sandbox &amp; Supabase Auth Engine Active
      </div>
    </div>
  );
}
