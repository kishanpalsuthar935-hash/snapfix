import React, { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode, BarChart3, Plus, Trash2, ArrowRight } from 'lucide-react';
import { generateQRMatrix } from '../../utils/qrGenerator';

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  tag: string;
  createdAt: string;
}

export const UrlShortenerTool: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [campaignTag, setCampaignTag] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  // List of links initialized empty (or empty array)
  const [links, setLinks] = useState<ShortenedLink[]>([]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    let validUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }

    const code = customAlias.trim()
      ? customAlias.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
      : Math.random().toString(36).substring(2, 8);

    const newLink: ShortenedLink = {
      id: Date.now().toString(),
      originalUrl: validUrl,
      shortCode: code,
      shortUrl: `https://vunix.co/${code}`,
      clicks: 0,
      tag: campaignTag.trim() || 'General',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    setLinks([newLink, ...links]);
    setOriginalUrl('');
    setCustomAlias('');
    setCampaignTag('');
  };

  const handleSimulateClick = (id: string, url: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, clicks: l.clicks + 1 } : l)));
    // Open in new tab or trigger simulation
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // ignore
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Shorten Form - Blank by default */}
      <form onSubmit={handleCreate} className="p-6 sm:p-8 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#451A03] mb-4">
          Create Branded Short Link
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6">
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Paste long URL (e.g. https://mybrand.com/long-page-path)..."
              className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03]"
            />
          </div>

          <div className="md:col-span-3">
            <div className="flex items-center rounded-2xl bg-white border border-neutral-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#451A03]">
              <span className="text-xs text-neutral-400 font-mono">vunix.co/</span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="custom-slug"
                className="w-full py-1.5 px-1 bg-transparent text-sm font-mono focus:outline-none text-[#451A03]"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <input
              type="text"
              value={campaignTag}
              onChange={(e) => setCampaignTag(e.target.value)}
              placeholder="Tag (e.g. Promo, Bio)"
              className="w-1/2 px-3 py-3 rounded-2xl bg-white border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#451A03]"
            />
            <button
              type="submit"
              disabled={!originalUrl.trim()}
              className="w-1/2 py-3 px-4 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Shorten
            </button>
          </div>
        </div>
      </form>

      {/* Generated Links List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Active Links & Real-Time Clicks ({links.length})
          </h4>
        </div>

        {links.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-neutral-200 bg-white text-center text-neutral-400">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#451A03]" />
            <p className="text-sm font-medium">No shortened links created yet.</p>
            <p className="text-xs text-neutral-400 mt-1">Paste a destination URL above to generate your first tracked link.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-neutral-300"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#451A03] hover:underline cursor-pointer"
                      onClick={() => handleSimulateClick(link.id, link.originalUrl)}
                    >
                      {link.shortUrl}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDE9FE] text-[#451A03]">
                      {link.tag}
                    </span>
                    <span className="text-xs text-neutral-400">{link.createdAt}</span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate max-w-md font-mono">
                    {link.originalUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Click counter badge */}
                  <div
                    onClick={() => handleSimulateClick(link.id, link.originalUrl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 cursor-pointer transition text-xs font-semibold text-neutral-700"
                    title="Click to simulate visitor visit"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#451A03]" />
                    <span>{link.clicks} clicks</span>
                  </div>

                  <button
                    onClick={() => handleCopy(link.id, link.shortUrl)}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium transition flex items-center gap-1"
                  >
                    {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === link.id ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={() => setQrModalUrl(link.shortUrl)}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-[#EDE9FE] text-neutral-700 hover:text-[#451A03] transition"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSimulateClick(link.id, link.originalUrl)}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                    title="Visit Target URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-neutral-400 hover:text-red-600 transition"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Preview Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
              Short Link QR Code
            </h3>
            <div className="p-4 bg-[#EDE9FE] rounded-2xl flex items-center justify-center">
              {(() => {
                const matrix = generateQRMatrix(qrModalUrl, 'M');
                return (
                  <svg viewBox={`0 0 ${matrix.length} ${matrix.length}`} className="w-48 h-48">
                    <rect width={matrix.length} height={matrix.length} fill="#EDE9FE" />
                    {matrix.map((row, r) =>
                      row.map((dark, c) =>
                        dark ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#451A03" /> : null
                      )
                    )}
                  </svg>
                );
              })()}
            </div>
            <p className="text-xs font-mono text-neutral-600 truncate">{qrModalUrl}</p>
            <button
              onClick={() => setQrModalUrl(null)}
              className="w-full py-2.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
