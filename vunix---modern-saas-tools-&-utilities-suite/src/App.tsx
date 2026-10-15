/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ToolGrid, TOOLS } from './components/ToolGrid';
import { ToolWorkspaceModal } from './components/ToolWorkspaceModal';
import { PaywallModal } from './components/PaywallModal';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { ToolCategory, UserProfile } from './types';
import { ShieldCheck, Download, Check, Crown, ArrowRight, LogOut, CheckCircle2, Info, X } from 'lucide-react';
import { usePWAInstall } from './hooks/usePWAInstall';
import { getCurrentSession, saveCurrentSession, clearCurrentSession, saveProSubscription } from './services/authService';
import {
  CurrencyConfig,
  getActiveCurrency,
  syncCurrencyOnSignIn,
} from './services/currencyService';

interface Toast {
  id: string;
  type: 'success' | 'info';
  message: string;
}

export default function App() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isGoogleSignInOpen, setIsGoogleSignInOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('terms');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // User session state (loaded from auth service, strictly null by default on fresh visit)
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentSession());

  // Localized Currency State (auto-detected via browser timezone/locale)
  const [currency, setCurrency] = useState<CurrencyConfig>(() => getActiveCurrency());

  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Automatic Authentication Prompt on Entry:
  // Trigger modal after 1 second if user is not logged in and hasn't chosen guest mode in this session
  useEffect(() => {
    const dismissedGuest = sessionStorage.getItem('vunix_guest_dismissed');
    if (!user && !dismissedGuest) {
      const timer = setTimeout(() => {
        setIsGoogleSignInOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Persist user in localStorage when user state changes
  useEffect(() => {
    if (user) {
      saveCurrentSession(user);
    }
  }, [user]);

  const handleSignInSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    saveCurrentSession(newUser);
    sessionStorage.removeItem('vunix_guest_dismissed');

    // Automatically detect & synchronize user country/currency on sign-in
    const detected = syncCurrencyOnSignIn();
    setCurrency(detected);

    showToast(
      `Welcome, ${newUser.name}! ${newUser.isPro ? 'Permanent PRO status active.' : 'Signed in on Free Plan.'}`,
      'success'
    );
  };


  // Rule 2 & 3: Only 3 Free tools should open freely.
  // If a signed-in Free user clicks on any of the 12 PRO tools, do not open the tool.
  // Instead, open the Paywall Checkout Modal ($30/mo or $200/yr with PayPal).
  const handleSelectTool = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) return;

    if (tool.isPro && !user?.isPro) {
      showToast(`${tool.name} requires a PRO Membership. Please choose a plan to unlock.`, 'info');
      setIsPaywallOpen(true);
      return;
    }

    setActiveToolId(toolId);
  };

  // 2. Complete Sign-Out Functionality
  const handleSignOut = () => {
    setUser(null);
    clearCurrentSession();
    sessionStorage.setItem('vunix_guest_dismissed', 'true');
    showToast('Successfully signed out. You are now browsing as Guest.', 'info');
  };

  const handleContinueAsGuest = () => {
    sessionStorage.setItem('vunix_guest_dismissed', 'true');
    setIsGoogleSignInOpen(false);
  };

  // Rule 4: Permanently associate PRO status with user Gmail ID
  const handleUpgradeSuccess = (plan: 'monthly' | 'annual', email?: string) => {
    const targetEmail = (email || user?.email || '').trim().toLowerCase();
    if (targetEmail) {
      const updatedUser = saveProSubscription(targetEmail, plan);
      setUser(updatedUser);
      showToast(`PRO Membership permanently linked to ${targetEmail}! All 12 PRO tools unlocked.`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-neutral-900 flex flex-col font-sans selection:bg-[#EDE9FE] selection:text-neutral-900 relative">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 transition-all ${
              toast.type === 'success'
                ? 'bg-neutral-900 text-white border-neutral-800'
                : 'bg-white text-neutral-900 border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-[#451A03]" />
                </div>
              )}
              <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Navigation Bar with Profile Dropdown */}
      <Header
        user={user}
        onOpenGoogleSignIn={() => setIsGoogleSignInOpen(true)}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onSignOut={handleSignOut}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        currentCurrency={currency}
      />

      {/* PWA Floating Install Banner if installable */}
      {isInstallable && !isInstalled && (
        <div className="bg-[#EDE9FE] border-b border-[#DDD6FE] py-2 px-4 text-xs text-[#451A03] flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium max-w-7xl mx-auto w-full justify-between">
            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#451A03]" />
              <strong>Install Vunix App:</strong> Get one-tap offline access on your desktop & mobile home screen.
            </span>
            <button
              onClick={install}
              className="px-4 py-1 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              Install App
            </button>
          </div>
        </div>
      )}

      {/* Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
        {/* Wix-Style Hero Section */}
        <HeroSection
          onStartNow={() => handleSelectTool('qr-generator')}
          onOpenTool={handleSelectTool}
          currentCurrency={currency}
        />

        {/* 15 Functional Tools Grid */}
        <ToolGrid
          onSelectTool={handleSelectTool}
          activeFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
          searchQuery={searchQuery}
          isUserPro={!!user?.isPro}
        />
      </main>

      {/* Modern Minimal Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#451A03] flex items-center justify-center text-[#EDE9FE] font-black text-xs">
                VX
              </div>
              <div>
                <p className="font-bold text-neutral-800">Vunix SaaS Platform</p>
                <p className="text-[11px]">Inspired by clean Wix design & craftsmanship</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium">
              <button
                onClick={() => setIsPaywallOpen(true)}
                className="hover:text-neutral-900 transition flex items-center gap-1 text-[#451A03] font-bold"
              >
                <Crown className="w-3.5 h-3.5" /> Pricing ({currency.monthlyFormatted}/mo)
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('free');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="hover:text-neutral-900 transition"
              >
                Free Essentials (3)
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('pro');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="hover:text-neutral-900 transition"
              >
                Commercial Tools (12)
              </button>
            </div>
          </div>

          {/* Legal Compliance & Copyright Links */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
            <div className="flex flex-wrap items-center gap-4 text-neutral-500">
              <button
                onClick={() => {
                  setActiveLegalDoc('terms');
                  setIsLegalModalOpen(true);
                }}
                className="hover:text-neutral-900 transition underline-offset-4 hover:underline"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveLegalDoc('privacy');
                  setIsLegalModalOpen(true);
                }}
                className="hover:text-neutral-900 transition underline-offset-4 hover:underline"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setActiveLegalDoc('refund');
                  setIsLegalModalOpen(true);
                }}
                className="hover:text-neutral-900 transition underline-offset-4 hover:underline"
              >
                Refund Policy
              </button>
            </div>

            <p>
              © {new Date().getFullYear()} Vunix. Zero clutter. Pure utility.
            </p>
          </div>
        </div>
      </footer>

      {/* Tool Workspace Modal */}
      <ToolWorkspaceModal
        toolId={activeToolId}
        onClose={() => setActiveToolId(null)}
        user={user}
        onOpenPaywall={() => setIsPaywallOpen(true)}
      />

      {/* Paywall Checkout Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        currentUser={user}
        onOpenGoogleSignIn={() => setIsGoogleSignInOpen(true)}
        onUpgradeSuccess={handleUpgradeSuccess}
        currentCurrency={currency}
      />

      {/* Google Sign-In Modal */}
      <GoogleSignInModal
        isOpen={isGoogleSignInOpen}
        onClose={handleContinueAsGuest}
        currentUser={user}
        onSignInSuccess={handleSignInSuccess}
        onSignOut={handleSignOut}
        onContinueAsGuest={handleContinueAsGuest}
        onOpenLegal={(doc) => {
          setActiveLegalDoc(doc);
          setIsLegalModalOpen(true);
        }}
      />

      {/* Legal & Policy Compliance Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialDoc={activeLegalDoc}
      />
    </div>
  );
}
