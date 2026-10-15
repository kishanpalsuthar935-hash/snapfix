import React from 'react';
import { X, Crown, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { TOOLS } from './ToolGrid';
import { UserProfile } from '../types';

// Tool Components
import { QRGeneratorTool } from './tools/QRGeneratorTool';
import { WordCounterTool } from './tools/WordCounterTool';
import { UrlShortenerTool } from './tools/UrlShortenerTool';
import { IdPhotoResizerTool } from './tools/IdPhotoResizerTool';
import { GstInvoiceTool } from './tools/GstInvoiceTool';
import { StorefrontBuilderTool } from './tools/StorefrontBuilderTool';
import { PdfSuiteTool } from './tools/PdfSuiteTool';
import { BgRemoverTool } from './tools/BgRemoverTool';
import { CaptionHashtagTool } from './tools/CaptionHashtagTool';
import { DigitalCardTool } from './tools/DigitalCardTool';
import { GstProfitCalculatorTool } from './tools/GstProfitCalculatorTool';
import { BookingLinkTool } from './tools/BookingLinkTool';
import { ResumeMakerTool } from './tools/ResumeMakerTool';
import { WhatsAppSenderTool } from './tools/WhatsAppSenderTool';
import { MultiLanguageTranslatorTool } from './tools/MultiLanguageTranslatorTool';

interface ToolWorkspaceModalProps {
  toolId: string | null;
  onClose: () => void;
  user: UserProfile | null;
  onOpenPaywall: () => void;
}

export const ToolWorkspaceModal: React.FC<ToolWorkspaceModalProps> = ({
  toolId,
  onClose,
  user,
  onOpenPaywall,
}) => {
  if (!toolId) return null;

  const tool = TOOLS.find((t) => t.id === toolId);
  if (!tool) return null;

  // Strict Permission Guard: PRO tools only open for PRO Members
  if (tool.isPro && !user?.isPro) {
    return null;
  }

  const renderActiveTool = () => {
    switch (toolId) {
      case 'qr-generator':
        return <QRGeneratorTool />;
      case 'word-counter':
        return <WordCounterTool />;
      case 'url-shortener':
        return <UrlShortenerTool />;
      case 'id-photo-resizer':
        return <IdPhotoResizerTool />;
      case 'gst-invoice':
        return <GstInvoiceTool />;
      case 'storefront-builder':
        return <StorefrontBuilderTool />;
      case 'pdf-suite':
        return <PdfSuiteTool />;
      case 'bg-remover':
        return <BgRemoverTool />;
      case 'caption-hashtag-ai':
        return <CaptionHashtagTool />;
      case 'digital-card':
        return <DigitalCardTool />;
      case 'gst-profit-calculator':
        return <GstProfitCalculatorTool />;
      case 'booking-link':
        return <BookingLinkTool />;
      case 'resume-builder':
        return <ResumeMakerTool />;
      case 'whatsapp-sender':
        return <WhatsAppSenderTool />;
      case 'multi-language-translator':
        return <MultiLanguageTranslatorTool />;
      default:
        return <div>Tool not found</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-5xl bg-[#F9FAFB] rounded-[36px] shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Workspace Top Header */}
        <div className="p-6 sm:px-8 border-b border-neutral-200 bg-white flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-neutral-900 tracking-tight">
                  {tool.name}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tool.isPro ? 'bg-[#451A03] text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tool.isPro ? 'Commercial Pro' : 'Free Essential'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-1">{tool.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {tool.isPro && !user?.isPro && (
              <button
                onClick={onOpenPaywall}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#451A03] border border-[#DDD6FE] text-xs font-bold hover:bg-[#DDD6FE] transition"
              >
                <Crown className="w-3.5 h-3.5" /> Upgrade Pro
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
              title="Close Workspace"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pro Banner if applicable */}
        {tool.isPro && !user?.isPro && (
          <div className="bg-[#EDE9FE] border-b border-[#DDD6FE] px-8 py-2.5 flex items-center justify-between text-xs text-[#451A03]">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Interactive Pro Preview Enabled. Inputs load fresh & blank.</span>
            </div>
            <button
              onClick={onOpenPaywall}
              className="font-bold underline hover:opacity-80 transition"
            >
              Unlock Unlimited Commercial License
            </button>
          </div>
        )}

        {/* Workspace Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {renderActiveTool()}
        </div>
      </div>
    </div>
  );
};
