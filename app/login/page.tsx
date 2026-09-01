'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Zap, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithGoogle, demoSignIn, isLoading } = useAuth();
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);

  if (user) {
    router.push('/');
    return null;
  }

  const handleGoogleLogin = async () => {
    setLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setLoggingIn(false);
    }
  };

  const handleDemoLogin = () => {
    demoSignIn();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 font-sans relative overflow-hidden select-none">
      
      {/* Top Right Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background ambient gradient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-8 backdrop-blur-xl">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-4">
          <BrandLogo size="lg" showTagline className="justify-center" />
          <p className="text-xs text-zinc-400">
            Intelligent Payment Recovery &amp; Subscription Failure Routing
          </p>
        </div>

        {/* Feature Pill Highlights */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>AI Cause Diagnosis</span>
          </div>
          <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Razorpay Sandbox</span>
          </div>
          <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Hard Stopping Rules</span>
          </div>
          <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Full Audit Trail</span>
          </div>
        </div>

        {/* Authentication Actions */}
        <div className="space-y-3 pt-2">
          {/* Primary Google Auth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loggingIn || isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-white/5 active:scale-[0.99] disabled:opacity-50"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Secondary Instant Demo Sign-In */}
          <button
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-850 text-zinc-300 hover:text-zinc-100 font-semibold text-xs border border-zinc-800 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Instant Demo Sign-In (Sandbox Mode)
          </button>
        </div>

        {/* Security Badge Footer */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> OAuth 2.0 Secure
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Razorpay Test Mode
          </span>
        </div>

      </div>

    </div>
  );
}
