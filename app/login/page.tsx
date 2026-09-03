'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

import { useAuth } from '@/lib/auth/context';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export default function LoginPage() {
  const { user, signInWithGoogle, demoSignIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // For 3D card effect - increased rotation range for pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      demoSignIn();
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleInstantDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      demoSignIn();
      setIsLoading(false);
      router.push('/');
    }, 500);
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-6 text-white font-sans select-none">
      {/* Background gradient effect - matches luxury purple/emerald DunningPilot style */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-purple-900/20 to-black" />

      {/* Top right Theme Toggle */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-500/15 blur-[100px] pointer-events-none" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-emerald-500/10 blur-[80px] pointer-events-none"
        animate={{ 
          opacity: [0.15, 0.35, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-600/15 blur-[90px] pointer-events-none"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.08, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: 'mirror',
          delay: 1
        }}
      />

      {/* Animated glow spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse opacity-40 pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-1000 opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Card glow effect */}
            <motion.div 
              className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 15px 2px rgba(168,85,247,0.15)",
                  "0 0 25px 6px rgba(16,185,129,0.25)",
                  "0 0 15px 2px rgba(168,85,247,0.15)"
                ],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: 'easeInOut', 
                repeatType: 'mirror' 
              }}
            />

            {/* Traveling light beam effect */}
            <div className="absolute -inset-[1px] rounded-3xl overflow-hidden pointer-events-none">
              {/* Top light beam */}
              <motion.div 
                className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80"
                initial={{ filter: 'blur(2px)' }}
                animate={{ 
                  left: ['-50%', '100%'],
                  opacity: [0.3, 0.8, 0.3],
                  filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)']
                }}
                transition={{ 
                  left: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror' },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror' }
                }}
              />
              
              {/* Right light beam */}
              <motion.div 
                className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-80"
                initial={{ filter: 'blur(2px)' }}
                animate={{ 
                  top: ['-50%', '100%'],
                  opacity: [0.3, 0.8, 0.3],
                  filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)']
                }}
                transition={{ 
                  top: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 0.6 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror', delay: 0.6 }
                }}
              />
              
              {/* Bottom light beam */}
              <motion.div 
                className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80"
                initial={{ filter: 'blur(2px)' }}
                animate={{ 
                  right: ['-50%', '100%'],
                  opacity: [0.3, 0.8, 0.3],
                  filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)']
                }}
                transition={{ 
                  right: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.2 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror', delay: 1.2 }
                }}
              />
              
              {/* Left light beam */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-80"
                initial={{ filter: 'blur(2px)' }}
                animate={{ 
                  bottom: ['-50%', '100%'],
                  opacity: [0.3, 0.8, 0.3],
                  filter: ['blur(1px)', 'blur(2.5px)', 'blur(1px)']
                }}
                transition={{ 
                  bottom: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.8 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: 'mirror', delay: 1.8 }
                }}
              />
            </div>

            {/* Glass card background */}
            <div className="relative bg-zinc-950/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/[0.08] shadow-2xl overflow-hidden">
              {/* Logo and header */}
              <div className="text-center space-y-3 mb-6">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="mx-auto flex justify-center"
                >
                  <BrandLogo size="lg" showTagline className="justify-center" />
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-zinc-400 text-xs font-mono"
                >
                  Autonomous Payment Recovery & Dunning Orchestration
                </motion.p>
              </div>

              {/* Feature Pill Highlights */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-6">
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AI Cause Diagnosis</span>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Razorpay Sandbox</span>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Hard Stopping Rules</span>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Full Audit Trail</span>
                </div>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div className="space-y-3">
                  {/* Email input */}
                  <motion.div 
                    className={focusedInput === 'email' ? 'relative z-10' : 'relative'}
                    whileFocus={{ scale: 1.01 }}
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-emerald-500/50 transition-all duration-300">
                      <Mail className={focusedInput === 'email' ? 'absolute left-3.5 w-4 h-4 text-emerald-400 transition-all duration-300' : 'absolute left-3.5 w-4 h-4 text-zinc-400 transition-all duration-300'} />
                      
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-transparent border-none text-white placeholder:text-zinc-500 h-11 transition-all duration-300 pl-11 pr-3 focus:ring-0"
                      />
                    </div>
                  </motion.div>

                  {/* Password input */}
                  <motion.div 
                    className={focusedInput === 'password' ? 'relative z-10' : 'relative'}
                    whileFocus={{ scale: 1.01 }}
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-emerald-500/50 transition-all duration-300">
                      <Lock className={focusedInput === 'password' ? 'absolute left-3.5 w-4 h-4 text-emerald-400 transition-all duration-300' : 'absolute left-3.5 w-4 h-4 text-zinc-400 transition-all duration-300'} />
                      
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-transparent border-none text-white placeholder:text-zinc-500 h-11 transition-all duration-300 pl-11 pr-11 focus:ring-0"
                      />
                      
                      {/* Toggle password visibility */}
                      <div 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3.5 cursor-pointer p-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/40"
                    />
                    <span>Remember session</span>
                  </label>
                  
                  <Link href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors font-mono text-[11px]">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign in button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="w-full relative group/button mt-4"
                >
                  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-bold h-11 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2 text-sm font-bold"
                        >
                          Sign In to Control Plane
                          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Minimal Divider */}
                <div className="relative my-4 flex items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-3 text-[11px] font-mono text-zinc-500">OR</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Google Sign In */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading || authLoading}
                  className="w-full relative group/google"
                >
                  <div className="relative overflow-hidden bg-white/5 hover:bg-white/10 text-white font-semibold h-11 rounded-xl border border-white/10 transition-all duration-300 flex items-center justify-center gap-3 text-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                </motion.button>

                {/* Instant Sandbox Demo Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleInstantDemo}
                  className="w-full relative group/demo mt-2"
                >
                  <div className="relative overflow-hidden bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 hover:text-purple-200 font-semibold h-10 rounded-xl border border-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Demo Sandbox (Skip Auth)</span>
                  </div>
                </motion.button>

                {/* Security footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> OAuth 2.0 Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Razorpay Test Mode
                  </span>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

