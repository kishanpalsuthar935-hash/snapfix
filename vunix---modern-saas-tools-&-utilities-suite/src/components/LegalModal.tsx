import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';

export type LegalDocType = 'terms' | 'privacy' | 'refund';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'terms',
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);

  // Synchronize initialDoc when modal opens
  React.useEffect(() => {
    setActiveDoc(initialDoc);
  }, [initialDoc, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[88vh] relative">
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#451A03] font-black text-sm border border-[#DDD6FE]">
              VX
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 tracking-tight">
                Vunix Legal & Compliance Center
              </h2>
              <p className="text-xs text-neutral-500">Official platform terms, privacy protocols, and refund policies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-200/60 hover:bg-neutral-200 text-neutral-700 transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 bg-neutral-50/40 border-b border-neutral-200 flex gap-2">
          <button
            onClick={() => setActiveDoc('terms')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeDoc === 'terms'
                ? 'border-[#451A03] text-[#451A03]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveDoc('privacy')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeDoc === 'privacy'
                ? 'border-[#451A03] text-[#451A03]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveDoc('refund')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeDoc === 'refund'
                ? 'border-[#451A03] text-[#451A03]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refund & Cancellation</span>
          </button>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-neutral-700 leading-relaxed font-sans">
          {activeDoc === 'terms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Last Updated: October 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#451A03]">
                  Version 2.4
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the Vunix SaaS platform (&quot;Vunix&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) via web or mobile PWA, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our utilities.
              </p>

              <h3 className="text-base font-bold text-neutral-900">2. Description of Service & Tiers</h3>
              <p>
                Vunix provides a suite of 15 web-based tools divided into <strong>3 Free Daily Essentials</strong> (QR Generator, Word Counter, URL Shortener) and <strong>12 Commercial Pro Tools</strong> (ID Photo Resizer, GST Invoicing, Storefront Builder, PDF Suite, Background Remover, etc.).
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Free Plan:</strong> Personal and basic commercial use of the 3 Daily Essentials at zero charge.</li>
                <li><strong>Commercial PRO Plan:</strong> Commercial access to all 12 commercial tools, high-resolution 300 DPI exports, and priority processing at $30/month or $200/year.</li>
              </ul>

              <h3 className="text-base font-bold text-neutral-900">3. User Content & Intellectual Property</h3>
              <p>
                You retain <strong>100% full ownership</strong> of all data, text, files, logos, invoices, and photos you create or process through Vunix. We do not claim intellectual property rights over any customer files, PDFs, or generated QR codes.
              </p>

              <h3 className="text-base font-bold text-neutral-900">4. Prohibited Uses</h3>
              <p>
                You agree not to use Vunix to generate fraudulent identification documents, illegal spam campaigns via WhatsApp Sender, malicious QR payloads, or copyrighted material without appropriate permissions.
              </p>

              <h3 className="text-base font-bold text-neutral-900">5. Limitation of Liability</h3>
              <p>
                Vunix utilities are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. In no event shall Vunix be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the platform.
              </p>
            </div>
          )}

          {activeDoc === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Last Updated: October 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#451A03]">
                  GDPR & CCPA Compliant
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900">1. Information We Collect</h3>
              <p>
                We only collect minimal information necessary to deliver our services:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Credentials:</strong> When you choose to sign in with Google, we receive basic profile information (your full name, email address, and avatar image) provided by Google Identity Services.</li>
                <li><strong>Payment Information:</strong> All financial transactions are processed securely through PayPal or registered bank settlement gateways. We never store credit card numbers or private CVVs on our servers.</li>
                <li><strong>Local Browser Storage:</strong> We use browser localStorage to maintain your active plan state and session preferences.</li>
              </ul>

              <h3 className="text-base font-bold text-neutral-900">2. Client-Side Privacy Architecture</h3>
              <p>
                <strong>Zero Image Upload to Remote Servers:</strong> ID Photo Resizing, Background Removal cutouts, PDF stamps, and Word Counts run entirely client-side inside your browser canvas. Your uploaded images and confidential business invoices are <strong>never transmitted or stored on external servers</strong>.
              </p>

              <h3 className="text-base font-bold text-neutral-900">3. Google User Data Policy Compliance</h3>
              <p>
                Vunix complies with the Google API Services User Data Policy. We only access standard user identity scopes (`email`, `profile`). We do not sell, rent, or transfer your Google user profile data to any third parties or advertising brokers.
              </p>

              <h3 className="text-base font-bold text-neutral-900">4. Data Deletion & Account Closure</h3>
              <p>
                You may revoke access or delete your local session anytime by clicking <strong>Sign Out</strong> in the user menu. If you wish to purge all account references from our payment ledgers, contact our privacy desk at support@vunix.app.
              </p>
            </div>
          )}

          {activeDoc === 'refund' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Effective: 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  14-Day Money-Back Guarantee
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900">1. 14-Day Money-Back Guarantee</h3>
              <p>
                We want you to be completely satisfied with Vunix Pro. If you are not satisfied with your purchase of a Monthly ($30) or Annual ($200) Commercial Pro Pass, you are eligible for a <strong>full 100% refund</strong> within 14 days of your initial payment date.
              </p>

              <h3 className="text-base font-bold text-neutral-900">2. Cancellation Policy</h3>
              <p>
                You may cancel your PRO subscription at any time. Upon cancellation:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your subscription will remain active until the end of the paid billing period.</li>
                <li>You will not be billed for any subsequent renewal cycles.</li>
                <li>Your account will automatically revert to the Free Plan with continuous access to the 3 Free Daily Essentials.</li>
              </ul>

              <h3 className="text-base font-bold text-neutral-900">3. How to Request a Refund</h3>
              <p>
                To request your refund within the 14-day window, simply send an email to <strong>refunds@vunix.app</strong> or open a transaction resolution request via your PayPal dashboard citing your Order ID. Refunds are typically processed back to your original payment method within 3–5 business days.
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 px-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Vunix SaaS Legal Agreement</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition shadow-sm"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};
