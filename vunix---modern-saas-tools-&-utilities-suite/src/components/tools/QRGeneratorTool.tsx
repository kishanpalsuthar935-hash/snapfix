import React, { useState, useId } from 'react';
import { Download, Copy, Check, RefreshCw, Palette, Sparkles, Smartphone, Wifi, Mail, Link as LinkIcon } from 'lucide-react';
import { generateQRMatrix, ECLevel } from '../../utils/qrGenerator';

export const QRGeneratorTool: React.FC = () => {
  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi' | 'vcard'>('url');
  const [content, setContent] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiAuth, setWifiAuth] = useState('WPA');
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');

  const [fgColor, setFgColor] = useState('#451A03');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [ecLevel, setEcLevel] = useState<ECLevel>('M');
  const [includeCenterIcon, setIncludeCenterIcon] = useState(false);
  const [copied, setCopied] = useState(false);

  const getQRData = (): string => {
    if (qrType === 'url' || qrType === 'text') {
      return content.trim();
    }
    if (qrType === 'wifi') {
      if (!wifiSsid) return '';
      return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};;`;
    }
    if (qrType === 'vcard') {
      if (!vcardName && !vcardPhone && !vcardEmail) return '';
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
    }
    return '';
  };

  const qrData = getQRData();
  const matrix = qrData ? generateQRMatrix(qrData, ecLevel) : [];
  const size = 300;
  const moduleSize = matrix.length > 0 ? size / matrix.length : 0;

  const downloadPNG = () => {
    if (matrix.length === 0) return;
    const canvas = document.createElement('canvas');
    const exportSize = 800;
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, exportSize, exportSize);

    // Modules
    const mSize = exportSize / matrix.length;
    ctx.fillStyle = fgColor;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix.length; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(c * mSize, r * mSize, mSize + 0.5, mSize + 0.5);
        }
      }
    }

    if (includeCenterIcon) {
      const centerBox = exportSize * 0.22;
      const centerPos = (exportSize - centerBox) / 2;
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(centerPos, centerPos, centerBox, centerBox, 16);
      ctx.fill();
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = fgColor;
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VX', exportSize / 2, exportSize / 2);
    }

    const link = document.createElement('a');
    link.download = `vunix-qr-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadSVG = () => {
    if (matrix.length === 0) return;
    const svgEl = document.getElementById('vunix-qr-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `vunix-qr-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copySVG = () => {
    const svgEl = document.getElementById('vunix-qr-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    navigator.clipboard.writeText(svgData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setContent('');
    setWifiSsid('');
    setWifiPassword('');
    setVcardName('');
    setVcardPhone('');
    setVcardEmail('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left controls */}
      <div className="lg:col-span-7 space-y-6">
        {/* QR Type pills */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-100 rounded-2xl w-fit">
          <button
            onClick={() => setQrType('url')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              qrType === 'url' ? 'bg-[#451A03] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Website URL
          </button>
          <button
            onClick={() => setQrType('text')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              qrType === 'text' ? 'bg-[#451A03] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Plain Text
          </button>
          <button
            onClick={() => setQrType('wifi')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              qrType === 'wifi' ? 'bg-[#451A03] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" /> WiFi Network
          </button>
          <button
            onClick={() => setQrType('vcard')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              qrType === 'vcard' ? 'bg-[#451A03] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Contact Card
          </button>
        </div>

        {/* Inputs - Load Blank by default */}
        <div className="space-y-4">
          {qrType === 'url' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Target URL (Website or Link)
              </label>
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03] focus:border-transparent transition"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Plain Text Message
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type any message, serial code, or instructions..."
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03] focus:border-transparent transition"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="MyHomeWiFi"
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  WiFi Password
                </label>
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Security Type
                </label>
                <select
                  value={wifiAuth}
                  onChange={(e) => setWifiAuth(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03]"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password (Open)</option>
                </select>
              </div>
            </div>
          )}

          {qrType === 'vcard' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={vcardName}
                  onChange={(e) => setVcardName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+1 555 0192"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#451A03]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Styling controls */}
        <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#451A03]" /> Custom Color Theme
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setFgColor('#451A03'); setBgColor('#EDE9FE'); }}
                className="px-2.5 py-1 text-xs rounded-full bg-[#EDE9FE] text-[#451A03] font-medium hover:opacity-80 transition"
              >
                Lilac Accent
              </button>
              <button
                onClick={() => { setFgColor('#451A03'); setBgColor('#FFFFFF'); }}
                className="px-2.5 py-1 text-xs rounded-full bg-neutral-200 text-neutral-800 font-medium hover:opacity-80 transition"
              >
                Terracotta
              </button>
              <button
                onClick={() => { setFgColor('#000000'); setBgColor('#FFFFFF'); }}
                className="px-2.5 py-1 text-xs rounded-full bg-black text-white font-medium hover:opacity-80 transition"
              >
                Mono Black
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                />
                <span className="text-xs font-mono font-medium text-neutral-700">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                />
                <span className="text-xs font-mono font-medium text-neutral-700">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-xs text-neutral-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCenterIcon}
                onChange={(e) => setIncludeCenterIcon(e.target.checked)}
                className="rounded text-[#451A03] focus:ring-[#451A03]"
              />
              <span>Embed Vunix Brand Badge in Center</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span>Error Correction:</span>
              {(['L', 'M', 'Q', 'H'] as ECLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEcLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    ecLevel === lvl ? 'bg-[#451A03] text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear All Fields
          </button>
        </div>
      </div>

      {/* Right Preview Card */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full p-8 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#451A03]/70 mb-4">
            High-Resolution Preview
          </span>

          <div
            className="p-6 rounded-2xl shadow-inner bg-white flex items-center justify-center transition-all duration-300 min-h-[260px] min-w-[260px]"
            style={{ backgroundColor: bgColor }}
          >
            {matrix.length > 0 ? (
              <svg
                id="vunix-qr-svg"
                viewBox={`0 0 ${matrix.length} ${matrix.length}`}
                className="w-56 h-56 transition-all"
                style={{ shapeRendering: 'crispEdges' }}
              >
                <rect width={matrix.length} height={matrix.length} fill={bgColor} />
                {matrix.map((row, r) =>
                  row.map((dark, c) =>
                    dark ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={fgColor} /> : null
                  )
                )}
                {includeCenterIcon && (
                  <g>
                    <rect
                      x={matrix.length * 0.38}
                      y={matrix.length * 0.38}
                      width={matrix.length * 0.24}
                      height={matrix.length * 0.24}
                      rx={1}
                      fill={bgColor}
                      stroke={fgColor}
                      strokeWidth={0.5}
                    />
                    <text
                      x={matrix.length / 2}
                      y={matrix.length / 2 + 0.6}
                      fill={fgColor}
                      fontSize={matrix.length * 0.12}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      VX
                    </text>
                  </g>
                )}
              </svg>
            ) : (
              <div className="flex flex-col items-center justify-center text-neutral-400 py-10 px-4">
                <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-medium">Enter details on the left to render your QR code</p>
              </div>
            )}
          </div>

          <p className="text-xs text-neutral-600 mt-4 max-w-xs truncate font-mono">
            {qrData || 'Waiting for data...'}
          </p>

          {/* Action buttons */}
          <div className="w-full mt-6 space-y-2">
            <button
              onClick={downloadPNG}
              disabled={matrix.length === 0}
              className="w-full py-3.5 px-6 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download 800px PNG
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={downloadSVG}
                disabled={matrix.length === 0}
                className="py-2.5 px-4 rounded-full bg-white text-neutral-800 border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 active:scale-[0.99] disabled:opacity-40 transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Vector SVG
              </button>
              <button
                onClick={copySVG}
                disabled={matrix.length === 0}
                className="py-2.5 px-4 rounded-full bg-white text-neutral-800 border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 active:scale-[0.99] disabled:opacity-40 transition flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy SVG'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
