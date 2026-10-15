import React from 'react';
import {
  QrCode,
  FileText,
  Link2,
  UserCheck,
  Receipt,
  ShoppingBag,
  FileStack,
  Wand2,
  Sparkles,
  Contact2,
  Calculator,
  Calendar,
  Briefcase,
  MessageCircle,
  Globe2,
  ArrowRight,
  Crown,
  Lock,
} from 'lucide-react';
import { ToolDef, ToolCategory } from '../types';

interface ToolGridProps {
  onSelectTool: (toolId: string) => void;
  activeFilter: ToolCategory;
  onFilterChange: (filter: ToolCategory) => void;
  searchQuery: string;
  isUserPro?: boolean;
}

export const TOOLS: ToolDef[] = [
  // 3 Free Daily Essentials
  {
    id: 'qr-generator',
    name: 'QR Generator',
    tagline: 'Custom vector QR with colors & logos',
    description: 'Create high-resolution QR codes for websites, plain text, WiFi networks, and contact cards with custom colors and center logo overlays.',
    category: 'free',
    isPro: false,
    accent: 'lavender',
    iconName: 'QrCode',
    badge: 'Free Essential',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    tagline: 'Character count, reading time & case transforms',
    description: 'Instant document statistics including character density, sentence counts, reading speed, and one-click case conversions.',
    category: 'free',
    isPro: false,
    accent: 'white',
    iconName: 'FileText',
    badge: 'Free Essential',
  },
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    tagline: 'Tracked branded links with QR codes',
    description: 'Generate clean short URLs with customizable aliases, campaign tags, simulated click analytics, and vector QR downloads.',
    category: 'free',
    isPro: false,
    accent: 'white',
    iconName: 'Link2',
    badge: 'Free Essential',
  },

  // 12 Pro Commercial Tools
  {
    id: 'id-photo-resizer',
    name: 'ID Photo Resizer',
    tagline: 'Passport, visa & 300 DPI print sheets',
    description: 'Official biometric passport, Schengen visa, and badge photo sizing with 300 DPI compliance and 4x6" printable sheet layouts.',
    category: 'design',
    isPro: true,
    accent: 'white',
    iconName: 'UserCheck',
    badge: 'Commercial Pro',
  },
  {
    id: 'gst-invoice',
    name: 'GST Invoice Generator',
    tagline: 'Tax-compliant invoices & PDF export',
    description: 'Commercial invoice creator with automatic CGST, SGST, IGST calculations, line items, buyer GSTIN validation, and print sheets.',
    category: 'business',
    isPro: true,
    accent: 'terracotta',
    iconName: 'Receipt',
    badge: 'Commercial Pro',
  },
  {
    id: 'storefront-builder',
    name: 'Storefront Builder',
    tagline: 'Link-in-bio ecommerce & mobile storefront',
    description: 'Craft beautiful mobile storefronts with catalog items, custom checkout links, social integration, and instant mobile mockup previews.',
    category: 'business',
    isPro: true,
    accent: 'lavender',
    iconName: 'ShoppingBag',
    badge: 'Commercial Pro',
  },
  {
    id: 'pdf-suite',
    name: 'PDF Suite',
    tagline: 'Merge, watermark, reorder & compress',
    description: 'Full document toolkit to combine multiple pages, apply custom watermark stamps, reorder pages, and optimize file sizes.',
    category: 'utility',
    isPro: true,
    accent: 'white',
    iconName: 'FileStack',
    badge: 'Commercial Pro',
  },
  {
    id: 'bg-remover',
    name: 'Background Remover',
    tagline: 'High-contrast alpha cutout & backdrops',
    description: 'Extract subjects with client-side edge and luminance detection. Export crystal-clear transparent PNGs or replace backdrops.',
    category: 'design',
    isPro: true,
    accent: 'white',
    iconName: 'Wand2',
    badge: 'Commercial Pro',
  },
  {
    id: 'caption-hashtag-ai',
    name: 'Caption & Hashtag AI',
    tagline: 'Viral hooks & targeted tag clusters',
    description: 'Generate captivating social copy for Instagram, LinkedIn, TikTok, and X with structured hooks, emojis, and high-reach tag groupings.',
    category: 'marketing',
    isPro: true,
    accent: 'lavender',
    iconName: 'Sparkles',
    badge: 'Commercial Pro',
  },
  {
    id: 'digital-card',
    name: 'Digital Visiting Card',
    tagline: '3D interactive flip card & .VCF export',
    description: 'Dynamic 3D digital business card with touch-to-flip motion, contact QR codes, and native .VCF download for phone address books.',
    category: 'business',
    isPro: true,
    accent: 'terracotta',
    iconName: 'Contact2',
    badge: 'Commercial Pro',
  },
  {
    id: 'gst-profit-calculator',
    name: 'GST & Profit Margin',
    tagline: 'Gross margin, markup & tax liability',
    description: 'Calculate true take-home earnings with inclusive/exclusive GST breakdown, expense tracking, and visual revenue distribution bars.',
    category: 'business',
    isPro: true,
    accent: 'white',
    iconName: 'Calculator',
    badge: 'Commercial Pro',
  },
  {
    id: 'booking-link',
    name: 'Booking Link',
    tagline: 'Appointment scheduling & .ICS calendar invites',
    description: 'Generate customized meeting invitations with duration options, direct Google Calendar links, and universal .ics calendar files.',
    category: 'utility',
    isPro: true,
    accent: 'white',
    iconName: 'Calendar',
    badge: 'Commercial Pro',
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    tagline: 'ATS-friendly professional resume sheets',
    description: 'Build polished CVs with structured work experience, education, competencies, and clean A4 print/PDF layouts.',
    category: 'business',
    isPro: true,
    accent: 'lavender',
    iconName: 'Briefcase',
    badge: 'Commercial Pro',
  },
  {
    id: 'whatsapp-sender',
    name: 'WhatsApp Sender',
    tagline: 'Bulk number cleaner & direct chat launcher',
    description: 'Sanitize messy phone numbers with country codes, personalize dynamic message templates, and launch direct WhatsApp chats.',
    category: 'marketing',
    isPro: true,
    accent: 'white',
    iconName: 'MessageCircle',
    badge: 'Commercial Pro',
  },
  {
    id: 'multi-language-translator',
    name: 'Multi-Language Translator',
    tagline: 'Multilingual dictionary & speech audio',
    description: 'Translate commercial text across 12+ international languages with natural speech audio pronunciation and quick copy tools.',
    category: 'utility',
    isPro: true,
    accent: 'white',
    iconName: 'Globe2',
    badge: 'Commercial Pro',
  },
];

// Map of required dedicated icons
const renderToolIcon = (name: string, isTerracotta: boolean = false) => {
  const iconClass = `w-5 h-5 shrink-0 ${isTerracotta ? 'text-white' : 'text-[#451A03]'}`;
  switch (name) {
    case 'QrCode':
      return <QrCode className={iconClass} />;
    case 'FileText':
      return <FileText className={iconClass} />;
    case 'Link2':
      return <Link2 className={iconClass} />;
    case 'UserCheck':
      return <UserCheck className={iconClass} />;
    case 'Receipt':
      return <Receipt className={iconClass} />;
    case 'ShoppingBag':
      return <ShoppingBag className={iconClass} />;
    case 'FileStack':
      return <FileStack className={iconClass} />;
    case 'Wand2':
      return <Wand2 className={iconClass} />;
    case 'Sparkles':
      return <Sparkles className={iconClass} />;
    case 'Contact2':
      return <Contact2 className={iconClass} />;
    case 'Calculator':
      return <Calculator className={iconClass} />;
    case 'Calendar':
      return <Calendar className={iconClass} />;
    case 'Briefcase':
      return <Briefcase className={iconClass} />;
    case 'MessageCircle':
      return <MessageCircle className={iconClass} />;
    case 'Globe2':
      return <Globe2 className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
};

export const ToolGrid: React.FC<ToolGridProps> = ({
  onSelectTool,
  activeFilter,
  onFilterChange,
  searchQuery,
  isUserPro = false,
}) => {
  const filteredTools = TOOLS.filter((tool) => {
    // Search query filter
    const matchesSearch =
      !searchQuery.trim() ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'free') return !tool.isPro;
    if (activeFilter === 'pro') return tool.isPro;
    return tool.category === activeFilter;
  });

  return (
    <section className="space-y-8">
      {/* Category Filter Pills Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeFilter === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            All 15 Tools
          </button>
          <button
            onClick={() => onFilterChange('free')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeFilter === 'free'
                ? 'bg-[#EDE9FE] text-[#451A03] border border-[#DDD6FE]'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            Free Essentials (3)
          </button>
          <button
            onClick={() => onFilterChange('pro')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeFilter === 'pro'
                ? 'bg-[#451A03] text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Commercial Pro (12)</span>
          </button>
          <button
            onClick={() => onFilterChange('business')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeFilter === 'business'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Business & Finance
          </button>
          <button
            onClick={() => onFilterChange('design')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeFilter === 'design'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Media & Design
          </button>
          <button
            onClick={() => onFilterChange('marketing')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeFilter === 'marketing'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Marketing & Social
          </button>
        </div>

        <span className="text-xs font-bold text-neutral-400">
          Showing {filteredTools.length} of 15 tools
        </span>
      </div>

      {/* Modern Wix-Inspired Cards Grid: Side-by-side card structure with zero visual clutter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const isTerracotta = tool.accent === 'terracotta';
          const isLavender = tool.accent === 'lavender';

          return (
            <div
              key={tool.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group ${
                isTerracotta
                  ? 'bg-[#451A03] text-white border border-[#301202]'
                  : isLavender
                  ? 'bg-[#EDE9FE] text-[#451A03] border border-[#DDD6FE]'
                  : 'bg-white text-neutral-900 border border-neutral-200 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                {/* Header with Dedicated Icon directly next to Tool Name */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition group-hover:scale-105 ${
                        isTerracotta
                          ? 'bg-white/10 border border-white/10'
                          : isLavender
                          ? 'bg-white border border-[#DDD6FE]'
                          : 'bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {renderToolIcon(tool.iconName, isTerracotta)}
                    </div>

                    <div>
                      {/* Dedicated High-Quality Icon placed directly next to tool name */}
                      <h3
                        className={`text-base font-bold tracking-tight leading-snug flex items-center gap-1.5 ${
                          isTerracotta ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        <span>{tool.name}</span>
                      </h3>
                      <p
                        className={`text-xs mt-0.5 line-clamp-1 ${
                          isTerracotta ? 'text-neutral-300' : isLavender ? 'text-[#451A03]/80' : 'text-neutral-500'
                        }`}
                      >
                        {tool.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                      tool.isPro
                        ? isTerracotta
                          ? 'bg-white/15 text-white'
                          : 'bg-[#451A03] text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tool.isPro && !isUserPro && <Lock className="w-2.5 h-2.5" />}
                    <span>{tool.isPro ? 'Pro' : 'Free'}</span>
                  </span>
                </div>

                {/* Description */}
                <p
                  className={`text-xs leading-relaxed line-clamp-3 ${
                    isTerracotta ? 'text-neutral-300' : isLavender ? 'text-[#451A03]/75' : 'text-neutral-600'
                  }`}
                >
                  {tool.description}
                </p>
              </div>

              {/* Action Button: High-contrast solid black pill-shaped button with rounded-full borders and white text */}
              <div className="pt-6 border-t border-current/10 mt-6 flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    isTerracotta ? 'text-neutral-300' : 'text-neutral-400'
                  }`}
                >
                  {tool.badge}
                </span>

                <button
                  onClick={() => onSelectTool(tool.id)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    isTerracotta
                      ? 'bg-white text-[#451A03] hover:bg-neutral-100'
                      : 'bg-black text-white hover:opacity-90'
                  }`}
                >
                  {tool.isPro && !isUserPro ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      <span>Unlock Pro</span>
                    </>
                  ) : (
                    <>
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
