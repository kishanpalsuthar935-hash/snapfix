import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Crown, Download, Search, Check, LogIn, ChevronDown, User, Shield, LogOut, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { CurrencyConfig, getActiveCurrency } from '../services/currencyService';

interface HeaderProps {
  user: UserProfile | null;
  onOpenGoogleSignIn: () => void;
  onOpenPaywall: () => void;
  onSignOut: () => void;
  onSearchChange: (q: string) => void;
  searchQuery: string;
  currentCurrency?: CurrencyConfig;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenGoogleSignIn,
  onOpenPaywall,
  onSignOut,
  onSearchChange,
  searchQuery,
  currentCurrency,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const currency = currentCurrency || getActiveCurrency();

  const handleSignOutClick = () => {
    setUserDropdownOpen(false);
    onSignOut();
  };

  const userInitial = user
    ? (user.name?.trim() || user.email?.trim() || 'U').charAt(0).toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo on Left */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#451A03] flex items-center justify-center shadow-sm relative overflow-hidden group">
            <div className="w-6 h-6 rounded-lg bg-[#EDE9FE] flex items-center justify-center text-[#451A03] font-black text-xs tracking-tighter transition group-hover:scale-105">
              VX
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-neutral-900 leading-none">
              Vunix
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#451A03] mt-0.5">
              SaaS Suite
            </span>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 15 essential & commercial tools..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-150 focus:bg-white border border-transparent focus:border-neutral-300 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* PWA Install Button */}
          {!isInstalled && (
            <>
              {isInstallable && (
                <button
                  onClick={install}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#451A03] text-xs font-bold transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
              )}
              {isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Add to Home</span>
                </button>
              )}
            </>
          )}

          {/* Pro Upgrade / Badge Button */}
          {user?.isPro ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#451A03] text-xs font-black tracking-wider uppercase border border-[#DDD6FE]">
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-current" /> PRO Member
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Free Plan</span>
              </div>
              <button
                onClick={onOpenPaywall}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#451A03] hover:bg-black text-white text-xs font-bold transition shadow-sm active:scale-95"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Upgrade to Pro ({currency.monthlyFormatted}/mo)</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenPaywall}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 text-xs font-bold transition"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Get Pro ({currency.monthlyFormatted}/mo)</span>
            </button>
          )}

          {/* User Profile Dropdown or Sign In Button */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-neutral-200 hover:border-neutral-300 bg-white transition shadow-xs focus:outline-none focus:ring-2 focus:ring-[#451A03]/20"
                aria-expanded={userDropdownOpen}
              >
                <span className="text-xs font-bold text-neutral-800 hidden sm:inline max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-black text-xs flex items-center justify-center ring-2 ring-[#EDE9FE] shadow-xs select-none shrink-0">
                  {userInitial}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Complete Profile Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 rounded-3xl bg-white border border-neutral-200 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* User Profile Header */}
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-black text-sm flex items-center justify-center ring-2 ring-[#451A03]/20 shrink-0 shadow-xs select-none">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate font-mono">{user.email}</p>
                    </div>
                  </div>

                  {/* Membership Status Badge */}
                  <div className="px-3 py-2.5 my-1 flex items-center justify-between border-b border-neutral-100">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Plan Status</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        user.isPro
                          ? 'bg-[#451A03] text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user.isPro ? (
                        <>
                          <Crown className="w-3 h-3 text-amber-300 fill-current" /> PRO Member
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Free Plan
                        </>
                      )}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="p-1 space-y-1">
                    {!user.isPro && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenPaywall();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#451A03] bg-[#EDE9FE]/50 hover:bg-[#EDE9FE] transition flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Crown className="w-3.5 h-3.5 text-[#451A03]" /> Upgrade to PRO ({currency.monthlyFormatted}/mo)
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenGoogleSignIn();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-neutral-500" /> Account Settings
                    </button>

                    <div className="my-1 border-t border-neutral-100" />

                    {/* Complete Sign Out Button with Red Logout Icon */}
                    <button
                      onClick={handleSignOutClick}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGoogleSignIn}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-800 text-xs font-semibold shadow-sm hover:shadow transition active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Install Vunix on iPhone / iPad</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              1. Tap the <strong>Share button</strong> in Safari toolbar.<br />
              2. Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.<br />
              3. Launch Vunix directly from your iOS app grid!
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
