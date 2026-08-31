'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ListFilter, 
  RotateCcw, 
  Terminal, 
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  onResetDemo?: () => void;
  isResetting?: boolean;
}

export function AppLayout({ children, onResetDemo, isResetting }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return <LoadingScreen message="Verifying Auth Session &amp; System Integrity..." />;
  }

  if (!user && pathname !== '/login') {
    return <LoadingScreen message="Redirecting to Login..." />;
  }

  const navItems = [
    { label: 'Command Center', href: '/', icon: LayoutDashboard },
    { label: 'Failure Cases', href: '/cases', icon: ListFilter },
    { label: 'Audit Trail', href: '/audit', icon: Terminal }
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-850 bg-zinc-950 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0">
        <div>
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 px-3 py-4 border-b border-zinc-800/60 mb-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-zinc-100">DunningPilot</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Payment Recovery Engine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Footer Actions */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/60">
          
          {/* User Session Profile Badge */}
          {user && (
            <div className="bg-zinc-900/90 rounded-xl p-3 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-zinc-700 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-200 truncate">{user.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate font-mono">{user.email}</div>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                title="Log Out"
                className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-all shrink-0 ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reset Demo Action Button */}
          {onResetDemo && (
            <button
              onClick={onResetDemo}
              disabled={isResetting}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-amber-400' : ''}`} />
              {isResetting ? 'Resetting Demo...' : 'Reset Demo State'}
            </button>
          )}

          <div className="px-1 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
            <span>Solo Hackathon MVP</span>
            <span className="text-emerald-400 font-semibold">Google Auth</span>
          </div>
        </div>
      </aside>

      {/* Main App Content View */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
