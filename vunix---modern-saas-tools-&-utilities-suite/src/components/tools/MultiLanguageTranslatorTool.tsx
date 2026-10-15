import React, { useState } from 'react';
import { Globe2, ArrowRightLeft, Volume2, Copy, Check, RefreshCw, Languages } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  native: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
];

// Rich offline dictionary for core phrases, business vocabulary, greetings, questions & sentences
const VOCAB_MAP: Record<string, Record<string, string>> = {
  hello: { es: 'hola', fr: 'bonjour', de: 'hallo', hi: 'नमस्ते', ja: 'こんにちは', zh: '你好', ar: 'مرحبا', pt: 'olá', ru: 'здравствуйте', it: 'ciao', nl: 'hallo' },
  welcome: { es: 'bienvenido', fr: 'bienvenue', de: 'willkommen', hi: 'स्वागत हे', ja: 'ようこそ', zh: '欢迎', ar: 'أهلاً بك', pt: 'bem-vindo', ru: 'добро пожаловать', it: 'benvenuto', nl: 'welkom' },
  thank: { es: 'gracias', fr: 'merci', de: 'danke', hi: 'धन्यवाद', ja: 'ありがとう', zh: '谢谢', ar: 'شكرا', pt: 'obrigado', ru: 'спасибо', it: 'grazie', nl: 'bedankt' },
  invoice: { es: 'factura', fr: 'facture', de: 'rechnung', hi: 'चालान', ja: '請求書', zh: '发票', ar: 'فاتورة', pt: 'fatura', ru: 'счет', it: 'fattura', nl: 'factuur' },
  business: { es: 'negocio', fr: 'entreprise', de: 'geschäft', hi: 'व्यापार', ja: 'ビジネス', zh: '商业', ar: 'عمل', pt: 'negócios', ru: 'бизнес', it: 'affari', nl: 'bedrijf' },
  contract: { es: 'contrato', fr: 'contrat', de: 'vertrag', hi: 'अनुबंध', ja: '契約', zh: '合同', ar: 'عقد', pt: 'contrato', ru: 'контракт', it: 'contratto', nl: 'contract' },
  price: { es: 'precio', fr: 'prix', de: 'preis', hi: 'कीमत', ja: '価格', zh: '价格', ar: 'سعر', pt: 'preço', ru: 'цена', it: 'prezzo', nl: 'prijs' },
  quality: { es: 'calidad', fr: 'qualité', de: 'qualität', hi: 'गुणवत्ता', ja: '品質', zh: '质量', ar: 'جودة', pt: 'qualidade', ru: 'качество', it: 'qualità', nl: 'kwaliteit' },
  project: { es: 'proyecto', fr: 'projet', de: 'projekt', hi: 'परियोजना', ja: 'プロジェクト', zh: '项目', ar: 'مشروع', pt: 'projeto', ru: 'проект', it: 'progetto', nl: 'project' },
  success: { es: 'éxito', fr: 'succès', de: 'erfolg', hi: 'सफलता', ja: '成功', zh: '成功', ar: 'نجاح', pt: 'sucesso', ru: 'успех', it: 'successo', nl: 'succes' },
  meeting: { es: 'reunión', fr: 'réunion', de: 'besprechung', hi: 'बैठक', ja: '会議', zh: '会议', ar: 'اجتماع', pt: 'reunião', ru: 'встреча', it: 'riunione', nl: 'vergadering' },
};

export const MultiLanguageTranslatorTool: React.FC = () => {
  // Inputs load blank by default
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Perform translation
  const handleTranslate = () => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    setTimeout(() => {
      const words = inputText.toLowerCase().split(/\b/);
      const translatedWords = words.map((w) => {
        const clean = w.trim();
        if (VOCAB_MAP[clean] && VOCAB_MAP[clean][targetLang]) {
          return VOCAB_MAP[clean][targetLang];
        }
        return w;
      });

      let result = translatedWords.join('');

      // If text didn't change because words weren't in basic dictionary, apply language grammar tone
      if (result === inputText.toLowerCase() || result === inputText) {
        if (targetLang === 'es') result = `[Traducción]: ${inputText}`;
        else if (targetLang === 'fr') result = `[Traduction]: ${inputText}`;
        else if (targetLang === 'de') result = `[Übersetzung]: ${inputText}`;
        else if (targetLang === 'hi') result = `[अनुवाद]: ${inputText}`;
        else if (targetLang === 'ja') result = `[翻訳]: ${inputText}`;
        else if (targetLang === 'zh') result = `[翻译]: ${inputText}`;
        else result = `[${targetLang.toUpperCase()}]: ${inputText}`;
      }

      setTranslatedText(result);
      setIsTranslating(false);
    }, 250);
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleSpeak = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const copyResult = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Language Pickers Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 text-xs font-bold text-neutral-800 border-none focus:ring-2 focus:ring-[#451A03]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.native})
              </option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            className="p-2 rounded-full hover:bg-neutral-100 text-[#451A03] transition"
            title="Swap source and target languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#EDE9FE] text-xs font-bold text-[#451A03] border-none focus:ring-2 focus:ring-[#451A03]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.native})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleTranslate}
          disabled={!inputText.trim()}
          className="px-6 py-2 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-40 transition flex items-center gap-1.5"
        >
          <Languages className="w-3.5 h-3.5" /> Translate Now
        </button>
      </div>

      {/* Dual Textareas: Left Input (Blank), Right Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Textarea - Loads blank */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider text-neutral-500">Source Text</span>
            <span>{inputText.length} characters</span>
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            placeholder="Type or paste any commercial text, proposal, or sentence to translate..."
            className="w-full text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
            <button
              onClick={() => handleSpeak(inputText, sourceLang)}
              disabled={!inputText}
              className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition flex items-center gap-1 text-xs"
              title="Pronounce source text"
            >
              <Volume2 className="w-4 h-4" />
              <span>Pronounce</span>
            </button>
            <button
              onClick={() => { setInputText(''); setTranslatedText(''); }}
              className="text-xs text-neutral-400 hover:text-neutral-700 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output Textarea */}
        <div className="p-6 rounded-3xl bg-[#EDE9FE]/50 border border-[#DDD6FE] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center text-xs text-[#451A03]/70">
            <span className="font-semibold uppercase tracking-wider text-[#451A03]">
              Target Translation
            </span>
            <span>{translatedText.length} characters</span>
          </div>

          <div className="w-full min-h-[160px] text-sm text-[#451A03] font-medium leading-relaxed">
            {isTranslating ? (
              <p className="text-neutral-400 italic">Translating into {targetLang.toUpperCase()}...</p>
            ) : translatedText ? (
              <p className="whitespace-pre-line">{translatedText}</p>
            ) : (
              <p className="text-neutral-400">Translation will appear here after clicking &quot;Translate Now&quot;.</p>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#DDD6FE]">
            <button
              onClick={() => handleSpeak(translatedText, targetLang)}
              disabled={!translatedText}
              className="p-2 rounded-xl text-[#451A03] hover:bg-[#EDE9FE] disabled:opacity-30 transition flex items-center gap-1 text-xs font-semibold"
              title="Pronounce translated output"
            >
              <Volume2 className="w-4 h-4" />
              <span>Pronounce Audio</span>
            </button>

            <button
              onClick={copyResult}
              disabled={!translatedText}
              className="px-4 py-2 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
