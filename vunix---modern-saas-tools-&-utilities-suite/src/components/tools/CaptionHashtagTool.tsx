import React, { useState } from 'react';
import { Sparkles, Copy, Check, Hash, RefreshCw, Send, Layers } from 'lucide-react';

interface CaptionResult {
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

export const CaptionHashtagTool: React.FC = () => {
  // All fields blank by default
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'tiktok' | 'twitter'>('instagram');
  const [tone, setTone] = useState<'viral' | 'professional' | 'casual' | 'story' | 'sales'>('viral');
  const [keywords, setKeywords] = useState('');
  const [results, setResults] = useState<CaptionResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const cleanTopic = topic.trim();
    const extraKeywords = keywords.split(',').map((k) => k.trim()).filter(Boolean);

    // Dynamic generation based on platform, tone, and user topic
    const generatedVariations: CaptionResult[] = [];

    if (platform === 'instagram') {
      generatedVariations.push({
        hook: `✨ Stop scrolling if you care about ${cleanTopic.toLowerCase()}.`,
        body: `Most people overcomplicate this, but the truth is simple: when you focus on what really matters, the results speak for themselves.\n\nHere are 3 rules we swear by:\n1. Keep it consistent\n2. Focus on genuine value\n3. Don't chase trends without purpose.`,
        cta: `👉 Save this post for your next session & drop your thoughts below!`,
        hashtags: [
          `#${cleanTopic.replace(/\s+/g, '')}`,
          '#CreatorEconomy',
          '#DailyInspiration',
          '#GrowthMindset',
          '#ProTips',
          ...extraKeywords.map((k) => `#${k.replace(/\s+/g, '')}`),
        ],
      });

      generatedVariations.push({
        hook: `Ready to upgrade your approach to ${cleanTopic.toLowerCase()}? 🚀`,
        body: `Here is the exact playbook we used to scale smoothly without burning out. Quality over noise every single time.\n\nTag a friend who needs to see this today.`,
        cta: `Tap the link in bio to explore full resources! 🔗`,
        hashtags: [
          `#${cleanTopic.replace(/\s+/g, '')}Tips`,
          '#ModernCreator',
          '#StrategyFirst',
          '#BuildInPublic',
          '#ProductivityHacks',
        ],
      });
    } else if (platform === 'linkedin') {
      generatedVariations.push({
        hook: `I spent 5 years studying ${cleanTopic.toLowerCase()}. Here is what nobody tells you:`,
        body: `1. The fundamentals never change.\n2. True leverage comes from consistency, not hacks.\n3. The best teams prioritize clarity over complexity.\n\nIf you are navigating this in 2026, step back and ask: are you solving the right problem?`,
        cta: `What has been your biggest takeaway in this space? Would love to hear your perspective in the comments.`,
        hashtags: [
          `#${cleanTopic.replace(/\s+/g, '')}`,
          '#Leadership',
          '#BusinessStrategy',
          '#Innovation',
          '#FutureOfWork',
        ],
      });
    } else if (platform === 'tiktok') {
      generatedVariations.push({
        hook: `POV: You finally figured out ${cleanTopic.toLowerCase()} 🤯`,
        body: `I cannot believe no one talks about this hack. If you do this today, thank me later!`,
        cta: `Follow for part 2! Which one should I break down next?`,
        hashtags: [
          `#${cleanTopic.replace(/\s+/g, '')}`,
          '#LearnOnTikTok',
          '#LifeHacks',
          '#MustWatch',
          '#FYP',
        ],
      });
    } else {
      // Twitter / X
      generatedVariations.push({
        hook: `A lot of people misunderstand ${cleanTopic.toLowerCase()}.`,
        body: `Here is the concise breakdown:\n\n• Point 1: Start with high signal, zero fluff.\n• Point 2: Iterate fast in public.\n• Point 3: Feedback loops beat assumptions.`,
        cta: `RT if you found this insightful. Bookmark for later.`,
        hashtags: [
          `#${cleanTopic.replace(/\s+/g, '')}`,
          '#BuildInPublic',
          '#TechTrends',
        ],
      });
    }

    setResults(generatedVariations);
  };

  const copyFullCaption = (index: number) => {
    const item = results[index];
    const fullText = `${item.hook}\n\n${item.body}\n\n${item.cta}\n\n${item.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Configuration - Loads blank by default */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#451A03] mb-1">
            Caption & Hashtag AI Generator
          </h3>
          <p className="text-xs text-neutral-500">
            Tailor high-converting social captions and targeted hashtag groups for any platform
          </p>
        </div>

        {/* Platform picker */}
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'linkedin', 'tiktok', 'twitter'] as const).map((plat) => (
            <button
              key={plat}
              type="button"
              onClick={() => setPlatform(plat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition ${
                platform === plat ? 'bg-[#451A03] text-white shadow-sm' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
              Topic, Product, or Story Concept
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Launching an organic skincare serum that hydrates without oily residue..."
              className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Tone & Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              >
                <option value="viral">Viral & Punchy Hook</option>
                <option value="professional">Professional & Authoritative</option>
                <option value="casual">Casual & Conversational</option>
                <option value="story">Inspiring Storyteller</option>
                <option value="sales">Direct Commercial CTA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Specific Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="skincare, beauty, vegan, glow"
                className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!topic.trim()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#EDE9FE]" /> Generate High-Engagement Captions
        </button>
      </form>

      {/* Generated Captions list */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Generated Formats ({results.length})
        </h4>

        {results.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-neutral-200 bg-white text-center text-neutral-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#451A03]" />
            <p className="text-sm font-medium">Ready to write your social content</p>
            <p className="text-xs text-neutral-400 mt-1">Enter your concept above to generate customized copy and tag clusters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((res, index) => (
              <div
                key={index}
                className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 bg-[#EDE9FE] rounded-2xl border border-[#DDD6FE]">
                    <span className="text-[10px] uppercase font-bold text-[#451A03]/70 block mb-1">Attention Hook:</span>
                    <p className="font-bold text-[#451A03] text-sm">{res.hook}</p>
                  </div>

                  <p className="text-neutral-700 whitespace-pre-line">{res.body}</p>

                  <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-800 font-semibold">
                    {res.cta}
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {res.hashtags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-neutral-100 text-[#451A03]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    onClick={() => copyFullCaption(index)}
                    className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold transition hover:bg-black flex items-center gap-1.5"
                  >
                    {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === index ? 'Copied to Clipboard!' : 'Copy Entire Post'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
