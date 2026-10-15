import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Zap, QrCode, Wand2, Receipt } from 'lucide-react';
import { CurrencyConfig, getActiveCurrency } from '../services/currencyService';

interface HeroSectionProps {
  onStartNow: () => void;
  onOpenTool: (toolId: string) => void;
  currentCurrency?: CurrencyConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartNow, onOpenTool, currentCurrency }) => {
  const currency = currentCurrency || getActiveCurrency();
  return (
    <section className="pt-8 pb-12">
      {/* Title & Tagline */}
      <div className="text-center max-w-3xl mx-auto mb-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#451A03] text-xs font-bold tracking-wider uppercase mb-4 border border-[#DDD6FE]">
          <Sparkles className="w-3.5 h-3.5 fill-[#451A03]" />
          <span>The Next-Generation Web Utility Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.08]">
          One unified suite for every daily task.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 mt-4 leading-relaxed max-w-2xl mx-auto">
          15 powerful tools designed with zero clutter. Generate vector QR codes, compute commercial GST invoices, resize official ID photos, and publish custom storefronts in seconds.
        </p>
      </div>

      {/* Modern Wix-Inspired Side-by-Side Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Card Accent 1: Soft Pastel Lavender / Lilac container (#EDE9FE) with large smooth corners (rounded-3xl) */}
        <div className="md:col-span-6 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] p-8 sm:p-10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#451A03] text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3 Free Daily Essentials</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#451A03] tracking-tight leading-snug">
              Fast, free & privacy-first utilities for everyone.
            </h2>

            <p className="text-sm text-[#451A03]/80 leading-relaxed max-w-md">
              Generate custom vector QR codes with colors and logo overlays, analyze word/case density, and track branded short links. No credit card or account needed.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-[#451A03]">
              <span className="px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-white/50 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" /> Vector QR Generator
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-white/50">
                Word & Case Counter
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-white/50">
                Tracked URL Shortener
              </span>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4">
            {/* High-contrast solid black pill-shaped button */}
            <button
              onClick={onStartNow}
              className="px-8 py-3.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 transition flex items-center gap-2 shadow-sm"
            >
              <span>Start Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#451A03]/70 font-medium">100% Free Forever</span>
          </div>
        </div>

        {/* Card Accent 2: Warm Earthy Terracotta / Rich Brown container (#451A03) with crisp white text and rounded-3xl corners */}
        <div className="md:col-span-6 rounded-3xl bg-[#451A03] text-white border border-[#301202] p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#EDE9FE] text-xs font-bold uppercase tracking-wider border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>12 Pro Commercial Tools</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Enterprise-grade tools built for business growth.
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-md">
              Create tax-compliant GST invoices, crop 300 DPI passport photos, remove photo backgrounds with instant alpha channel cutout, and deploy mobile storefronts.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-neutral-200">
              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5" /> GST Invoice Maker
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" /> Subject BG Remover
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                Link-in-Bio Storefront
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                3D Digital Card
              </span>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4">
            {/* High-contrast solid black pill-shaped button */}
            <button
              onClick={() => onOpenTool('gst-invoice')}
              className="px-8 py-3.5 rounded-full bg-white text-[#451A03] text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 active:scale-95 transition flex items-center gap-2 shadow-sm"
            >
              <span>Open Tool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-neutral-400 font-medium">
              {currency.monthlyFormatted}/mo or {currency.annualFormatted}/yr
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
