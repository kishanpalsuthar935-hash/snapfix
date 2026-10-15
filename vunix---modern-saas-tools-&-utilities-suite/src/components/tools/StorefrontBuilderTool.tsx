import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag, ExternalLink, Share2, Copy, Check, Smartphone, Sparkles } from 'lucide-react';

interface StoreProduct {
  id: string;
  name: string;
  price: string;
  tag: string;
  url: string;
  description: string;
}

export const StorefrontBuilderTool: React.FC = () => {
  // All fields blank by default
  const [storeName, setStoreName] = useState('');
  const [storeHandle, setStoreHandle] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState<'lilac' | 'terracotta' | 'minimal' | 'dark'>('lilac');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [copied, setCopied] = useState(false);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: '',
        price: '',
        tag: '',
        url: '',
        description: '',
      },
    ]);
  };

  const updateProduct = (id: string, field: keyof StoreProduct, value: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'terracotta':
        return {
          bg: 'bg-[#451A03]',
          text: 'text-white',
          card: 'bg-white/10 text-white border-white/20',
          btn: 'bg-white text-[#451A03]',
          accent: 'text-[#EDE9FE]',
        };
      case 'dark':
        return {
          bg: 'bg-neutral-900',
          text: 'text-white',
          card: 'bg-neutral-800 text-white border-neutral-700',
          btn: 'bg-white text-black',
          accent: 'text-neutral-400',
        };
      case 'minimal':
        return {
          bg: 'bg-white',
          text: 'text-neutral-900',
          card: 'bg-neutral-50 text-neutral-900 border-neutral-200',
          btn: 'bg-black text-white',
          accent: 'text-neutral-500',
        };
      case 'lilac':
      default:
        return {
          bg: 'bg-[#EDE9FE]',
          text: 'text-[#451A03]',
          card: 'bg-white text-neutral-900 border-[#DDD6FE]',
          btn: 'bg-[#451A03] text-white',
          accent: 'text-[#451A03]/70',
        };
    }
  };

  const currentTheme = getThemeStyles();
  const shareUrl = `https://vunix.bio/${storeHandle || 'your-brand'}`;

  const copyStoreLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor Column */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Brand Profile & Store Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Store / Creator Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Aura Studio"
                className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Bio Handle URL</label>
              <div className="flex items-center px-3 py-1 rounded-2xl border border-neutral-200 focus-within:ring-2 focus-within:ring-[#451A03]">
                <span className="text-xs text-neutral-400 font-mono">vunix.bio/</span>
                <input
                  type="text"
                  value={storeHandle}
                  onChange={(e) => setStoreHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="brandname"
                  className="w-full py-1.5 px-1 bg-transparent text-sm font-mono focus:outline-none text-[#451A03]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Bio / Headline</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Handcrafted organic home decor • Worldwide delivery"
              className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Instagram (@handle)</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@brand"
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">WhatsApp Order Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1 555 0192"
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Color Theme</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setTheme('lilac')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  theme === 'lilac' ? 'bg-[#EDE9FE] border-[#451A03] text-[#451A03]' : 'bg-white border-neutral-200'
                }`}
              >
                Soft Lilac
              </button>
              <button
                onClick={() => setTheme('terracotta')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  theme === 'terracotta' ? 'bg-[#451A03] border-black text-white' : 'bg-white border-neutral-200'
                }`}
              >
                Terracotta
              </button>
              <button
                onClick={() => setTheme('minimal')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  theme === 'minimal' ? 'bg-neutral-100 border-neutral-900 text-neutral-900' : 'bg-white border-neutral-200'
                }`}
              >
                Pure White
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-200'
                }`}
              >
                Obsidian
              </button>
            </div>
          </div>
        </div>

        {/* Product Catalog */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Products / Action Links ({products.length})
            </span>
            <button
              onClick={addProduct}
              className="px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#451A03] text-xs font-semibold hover:bg-[#DDD6FE] transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Product Card
            </button>
          </div>

          {products.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-200 rounded-2xl text-center text-neutral-400">
              <ShoppingBag className="w-6 h-6 mx-auto mb-1 opacity-40 text-[#451A03]" />
              <p className="text-xs">No products listed. Click &quot;Add Product Card&quot; to showcase items or booking links.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p, index) => (
                <div key={p.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500">Item #{index + 1}</span>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="text-neutral-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                      placeholder="Product or Service Name"
                      className="sm:col-span-6 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
                    />
                    <input
                      type="text"
                      value={p.price}
                      onChange={(e) => updateProduct(p.id, 'price', e.target.value)}
                      placeholder="Price (e.g. $49)"
                      className="sm:col-span-3 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
                    />
                    <input
                      type="text"
                      value={p.tag}
                      onChange={(e) => updateProduct(p.id, 'tag', e.target.value)}
                      placeholder="Badge (e.g. Best Seller)"
                      className="sm:col-span-3 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
                    />
                  </div>
                  <input
                    type="url"
                    value={p.url}
                    onChange={(e) => updateProduct(p.id, 'url', e.target.value)}
                    placeholder="Checkout / Destination Link (e.g. https://buy.stripe.com/...)"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#451A03]"
                  />
                  <input
                    type="text"
                    value={p.description}
                    onChange={(e) => updateProduct(p.id, 'description', e.target.value)}
                    placeholder="Short 1-line description"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Live Mobile Mockup */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full max-w-[340px] rounded-[44px] p-4 bg-neutral-900 shadow-2xl border-[6px] border-neutral-800">
          {/* Phone Top Notch */}
          <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-4" />

          {/* Screen Content */}
          <div className={`rounded-[32px] p-6 min-h-[520px] transition-all duration-300 ${currentTheme.bg} flex flex-col items-center text-center overflow-y-auto max-h-[580px]`}>
            {/* Store Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur border border-white/40 flex items-center justify-center text-2xl font-bold shadow-sm mb-3">
              {storeName ? storeName.charAt(0).toUpperCase() : <ShoppingBag className="w-8 h-8 opacity-40" />}
            </div>

            <h4 className={`text-base font-extrabold tracking-tight ${currentTheme.text}`}>
              {storeName || 'Your Store Name'}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${currentTheme.accent}`}>
              {bio || 'Your store bio and product offerings will appear here live as you type.'}
            </p>

            {/* Social pills */}
            <div className="flex gap-2 my-4">
              {instagram && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/40 backdrop-blur">
                  {instagram}
                </span>
              )}
              {whatsapp && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
                  WhatsApp Direct
                </span>
              )}
            </div>

            {/* Products container */}
            <div className="w-full space-y-2.5 mt-2">
              {products.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white/20 border border-dashed border-white/40 text-xs opacity-70">
                  Products added on left will show up here as mobile cards
                </div>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border shadow-sm text-left transition hover:scale-[1.02] ${currentTheme.card}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{p.name || 'Untitled Product'}</span>
                      {p.price && <span className="text-xs font-mono font-bold">{p.price}</span>}
                    </div>
                    {p.description && <p className="text-[11px] opacity-75 mt-0.5 truncate">{p.description}</p>}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
                      {p.tag ? (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/10">
                          {p.tag}
                        </span>
                      ) : <span />}
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${currentTheme.btn} flex items-center gap-1`}>
                        Buy Now <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="w-full max-w-[340px] mt-4 flex items-center gap-2">
          <button
            onClick={copyStoreLink}
            className="flex-1 py-3 px-4 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Link Copied!' : 'Copy Storefront Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
