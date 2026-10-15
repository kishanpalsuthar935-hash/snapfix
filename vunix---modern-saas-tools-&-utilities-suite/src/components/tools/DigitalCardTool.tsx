import React, { useState } from 'react';
import { Phone, Mail, Globe, MapPin, Download, RefreshCw, Smartphone, QrCode, Share2, Check } from 'lucide-react';
import { generateQRMatrix } from '../../utils/qrGenerator';

export const DigitalCardTool: React.FC = () => {
  // All fields blank by default
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState<'terracotta' | 'lilac' | 'obsidian'>('terracotta');
  const [isFlipped, setIsFlipped] = useState(false);
  const [vcfDownloaded, setVcfDownloaded] = useState(false);

  // Generate standard vCard .vcf string
  const generateVcfString = () => {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${fullName || 'Contact Name'}`,
      `ORG:${company || ''}`,
      `TITLE:${jobTitle || ''}`,
      `TEL;TYPE=CELL:${phone || ''}`,
      `EMAIL:${email || ''}`,
      `URL:${website || ''}`,
      `ADR;TYPE=WORK:;;${city || ''};;;;`,
      `NOTE:${bio || ''}`,
      'END:VCARD',
    ].join('\n');
  };

  const downloadVcf = () => {
    const vcfContent = generateVcfString();
    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${(fullName || 'contact').toLowerCase().replace(/\s+/g, '-')}-card.vcf`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setVcfDownloaded(true);
    setTimeout(() => setVcfDownloaded(false), 2000);
  };

  const vcfQrData = generateVcfString();
  const matrix = fullName || phone || email ? generateQRMatrix(vcfQrData, 'M') : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form: All blank by default */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Personal & Professional Profile
            </h3>
            {/* Color switcher */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme('terracotta')}
                className={`w-6 h-6 rounded-full bg-[#451A03] border-2 ${
                  theme === 'terracotta' ? 'border-black scale-110' : 'border-transparent'
                }`}
                title="Terracotta Card"
              />
              <button
                onClick={() => setTheme('lilac')}
                className={`w-6 h-6 rounded-full bg-[#EDE9FE] border-2 ${
                  theme === 'lilac' ? 'border-[#451A03] scale-110' : 'border-transparent'
                }`}
                title="Lilac Card"
              />
              <button
                onClick={() => setTheme('obsidian')}
                className={`w-6 h-6 rounded-full bg-neutral-900 border-2 ${
                  theme === 'obsidian' ? 'border-amber-400 scale-110' : 'border-transparent'
                }`}
                title="Obsidian Card"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Vance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Job Designation</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Managing Partner"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Organization / Agency</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Ventures"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">City / Country</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. London, UK"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Mobile / Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0192"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@apex.io"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://apex.io"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Bio / Tagline</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Building next-gen digital experiences & investments"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>
        </div>

        {/* Quick NFC Instructions card */}
        <div className="p-4 rounded-2xl bg-[#EDE9FE]/50 border border-[#DDD6FE] flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-[#451A03] shrink-0" />
          <div className="text-xs text-neutral-700">
            <span className="font-bold text-[#451A03]">NFC & Virtual Share:</span>
            {' '}Tap the card on the right to flip between Front details and the dynamic Quick-Add QR Code.
          </div>
        </div>
      </div>

      {/* Right Column: 3D Interactive Card Preview */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#451A03]" /> Tap Card to Flip (3D View)
          </span>

          {/* 3D Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-sm aspect-[1.75/1] rounded-3xl cursor-pointer transition-all duration-700 select-none shadow-xl transform-gpu hover:scale-105"
            style={{ perspective: '1000px' }}
          >
            <div
              className={`w-full h-full rounded-3xl p-6 transition-all duration-500 relative flex flex-col justify-between ${
                theme === 'terracotta'
                  ? 'bg-[#451A03] text-white border border-[#301202]'
                  : theme === 'lilac'
                  ? 'bg-[#EDE9FE] text-[#451A03] border border-[#DDD6FE]'
                  : 'bg-neutral-900 text-white border border-neutral-800'
              }`}
            >
              {!isFlipped ? (
                /* Card Front */
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold tracking-widest uppercase opacity-75">
                        {company || 'YOUR COMPANY'}
                      </span>
                      <h4 className="text-xl font-black tracking-tight mt-1">
                        {fullName || 'Your Full Name'}
                      </h4>
                      <p className="text-xs opacity-85">{jobTitle || 'Designation / Role'}</p>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center font-bold text-sm">
                      {fullName ? fullName.charAt(0).toUpperCase() : 'V'}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs opacity-90 pt-3 border-t border-current/20">
                    {phone && (
                      <p className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-3 h-3" /> {phone}
                      </p>
                    )}
                    {email && (
                      <p className="flex items-center gap-1.5 truncate font-mono">
                        <Mail className="w-3 h-3" /> {email}
                      </p>
                    )}
                    {website && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Globe className="w-3 h-3" /> {website.replace(/^https?:\/\//, '')}
                      </p>
                    )}
                    {city && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {city}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* Card Back */
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-75">
                    Scan to Save Contact (.vcf)
                  </span>

                  <div className="p-2 bg-white rounded-xl shadow-md">
                    {matrix.length > 0 ? (
                      <svg viewBox={`0 0 ${matrix.length} ${matrix.length}`} className="w-24 h-24">
                        <rect width={matrix.length} height={matrix.length} fill="#FFFFFF" />
                        {matrix.map((row, r) =>
                          row.map((dark, c) =>
                            dark ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#451A03" /> : null
                          )
                        )}
                      </svg>
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center text-neutral-400 text-[10px]">
                        Add info
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono opacity-80">
                    NFC Virtual Contact Ready
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full max-w-sm mt-6 space-y-2">
            <button
              onClick={downloadVcf}
              disabled={!fullName && !phone && !email}
              className="w-full py-3.5 px-6 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm"
            >
              {vcfDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              {vcfDownloaded ? 'vCard Downloaded!' : 'Download .VCF Contact File'}
            </button>
            <p className="text-[11px] text-neutral-400 text-center">
              Directly imports into iOS Contacts and Google Contacts on any phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
