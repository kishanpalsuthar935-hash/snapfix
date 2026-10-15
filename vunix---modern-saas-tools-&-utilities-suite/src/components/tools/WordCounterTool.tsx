import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Type, BookOpen, Clock, FileText } from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Computations
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charWithSpaces = text.length;
  const charWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0) : [];
  const sentenceCount = sentences.length;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0) : [];
  const paragraphCount = paragraphs.length;

  // Reading time (approx 200 words/min)
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  // Speaking time (approx 130 words/min)
  const speakingTimeMinutes = Math.ceil(wordCount / 130);

  // Case transforms
  const transformUpper = () => setText(text.toUpperCase());
  const transformLower = () => setText(text.toLowerCase());
  const transformTitle = () => {
    setText(
      text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      )
    );
  };
  const transformSentence = () => {
    setText(
      text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
  };
  const transformCamel = () => {
    const words = text.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean);
    if (words.length === 0) return;
    const camel = words[0] + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    setText(camel);
  };
  const transformSlug = () => {
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setText(slug);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => setText('');

  return (
    <div className="space-y-6">
      {/* Top metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm text-center">
          <span className="block text-2xl font-bold text-neutral-900">{wordCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Words</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm text-center">
          <span className="block text-2xl font-bold text-neutral-900">{charWithSpaces}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Characters</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm text-center">
          <span className="block text-2xl font-bold text-neutral-900">{charWithoutSpaces}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">No Spaces</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm text-center">
          <span className="block text-2xl font-bold text-neutral-900">{sentenceCount}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Sentences</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-center">
          <span className="block text-2xl font-bold text-[#451A03]">{readingTimeMinutes}m</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#451A03]/70 flex items-center justify-center gap-1">
            <BookOpen className="w-3 h-3" /> Read Time
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#451A03] text-white text-center">
          <span className="block text-2xl font-bold">{speakingTimeMinutes}m</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Speak Time
          </span>
        </div>
      </div>

      {/* Main Text Area - Blank by default */}
      <div className="relative">
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or start typing your document text here..."
          className="w-full p-6 rounded-3xl border border-neutral-200 bg-white text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#451A03] focus:border-transparent transition leading-relaxed shadow-sm resize-y"
        />
        {text && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={copyText}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition text-xs font-medium flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={clearText}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 transition"
              title="Clear text"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Format & Case Conversion Toolbar */}
      <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-[#451A03]" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Quick Transform:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={transformSentence}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-100 active:scale-95 disabled:opacity-40 transition"
          >
            Sentence case
          </button>
          <button
            onClick={transformTitle}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-100 active:scale-95 disabled:opacity-40 transition"
          >
            Title Case
          </button>
          <button
            onClick={transformUpper}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-100 active:scale-95 disabled:opacity-40 transition"
          >
            UPPERCASE
          </button>
          <button
            onClick={transformLower}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-100 active:scale-95 disabled:opacity-40 transition"
          >
            lowercase
          </button>
          <button
            onClick={transformCamel}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-100 active:scale-95 disabled:opacity-40 transition"
          >
            camelCase
          </button>
          <button
            onClick={transformSlug}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-100 active:scale-95 disabled:opacity-40 transition"
          >
            kebab-slug
          </button>
        </div>

        <button
          onClick={copyText}
          disabled={!text}
          className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-40 transition flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
};
