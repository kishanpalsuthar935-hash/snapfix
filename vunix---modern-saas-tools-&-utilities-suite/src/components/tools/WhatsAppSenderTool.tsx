import React, { useState } from 'react';
import { MessageCircle, Send, Check, Copy, Download, RefreshCw, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';

interface CleanedContact {
  raw: string;
  formatted: string;
  isValid: boolean;
  name: string;
}

export const WhatsAppSenderTool: React.FC = () => {
  // Inputs load blank by default
  const [rawNumbers, setRawNumbers] = useState('');
  const [defaultCountryCode, setDefaultCountryCode] = useState('91');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Parse raw text into structured contacts
  const parseContacts = (): CleanedContact[] => {
    if (!rawNumbers.trim()) return [];

    const lines = rawNumbers.split(/[\n,;]+/).map((l) => l.trim()).filter(Boolean);
    const results: CleanedContact[] = [];

    lines.forEach((line) => {
      // Check if line contains a name and number like "John Doe: 9876543210" or just number
      let name = 'Valued Customer';
      let phonePart = line;

      if (line.includes(':') || line.includes('-') || line.includes(',')) {
        const parts = line.split(/[:,-]/);
        if (parts.length >= 2 && isNaN(Number(parts[0].replace(/\s/g, '')))) {
          name = parts[0].trim();
          phonePart = parts.slice(1).join('');
        }
      }

      // Clean digits
      const digitsOnly = phonePart.replace(/\D/g, '');
      let finalNumber = digitsOnly;

      if (digitsOnly.length === 10) {
        finalNumber = defaultCountryCode + digitsOnly;
      }

      const isValid = finalNumber.length >= 10 && finalNumber.length <= 15;

      results.push({
        raw: line,
        formatted: finalNumber,
        isValid,
        name,
      });
    });

    return results;
  };

  const contacts = parseContacts();

  const getWaUrl = (contact: CleanedContact) => {
    const text = messageTemplate
      .replace(/{name}/gi, contact.name)
      .replace(/{phone}/gi, contact.formatted);
    return `https://wa.me/${contact.formatted}?text=${encodeURIComponent(text)}`;
  };

  const copyNumber = (index: number, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportCleanCsv = () => {
    if (contacts.length === 0) return;
    const header = 'Name,FormattedPhone,Status\n';
    const rows = contacts
      .map((c) => `"${c.name}","+${c.formatted}","${c.isValid ? 'Valid' : 'Invalid'}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `vunix-whatsapp-list-${Date.now()}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor Column */}
      <div className="lg:col-span-6 space-y-6">
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Bulk Number Cleaner & Formatter
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span>Default Code:</span>
              <select
                value={defaultCountryCode}
                onChange={(e) => setDefaultCountryCode(e.target.value)}
                className="px-2 py-1 rounded-lg border border-neutral-200 bg-white font-mono text-xs"
              >
                <option value="91">+91 (India)</option>
                <option value="1">+1 (USA/Canada)</option>
                <option value="44">+44 (UK)</option>
                <option value="61">+61 (Australia)</option>
                <option value="971">+971 (UAE)</option>
                <option value="49">+49 (Germany)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Raw Phone Numbers (1 per line or comma separated)
            </label>
            <textarea
              rows={5}
              value={rawNumbers}
              onChange={(e) => setRawNumbers(e.target.value)}
              placeholder="Paste numbers here, e.g.:&#10;+91 98765-43210&#10;Alex: 555-0199&#10;9812345678"
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Auto-strips spaces, dashes, parentheses and applies country code.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-semibold text-neutral-600">
                Message Template (Supports {'{name}'} and {'{phone}'})
              </label>
            </div>
            <textarea
              rows={4}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              placeholder="Hi {name}, thank you for reaching out! Here is your requested information..."
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Cleaned Contact Dispatcher */}
      <div className="lg:col-span-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Validated Numbers ({contacts.length})
          </span>
          {contacts.length > 0 && (
            <button
              onClick={exportCleanCsv}
              className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Clean CSV
            </button>
          )}
        </div>

        {contacts.length === 0 ? (
          <div className="p-12 border border-dashed border-neutral-200 rounded-3xl bg-white text-center text-neutral-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#451A03]" />
            <p className="text-sm font-medium">No numbers entered yet</p>
            <p className="text-xs text-neutral-400 mt-1">Paste raw contact numbers on the left to sanitize and prepare direct chats.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900">{contact.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        contact.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {contact.isValid ? 'Valid' : 'Check Digits'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-500 mt-0.5">+{contact.formatted}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyNumber(index, `+${contact.formatted}`)}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                    title="Copy number"
                  >
                    {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={getWaUrl(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-full text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-sm ${
                      contact.isValid ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-neutral-400 pointer-events-none'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" /> Direct Chat
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
