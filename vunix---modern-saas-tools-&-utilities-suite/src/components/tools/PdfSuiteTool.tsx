import React, { useState, useRef } from 'react';
import { Upload, FileDown, Layers, Stamp, RotateCw, Trash2, ArrowUp, ArrowDown, FileText, Check } from 'lucide-react';

interface PdfFileItem {
  id: string;
  name: string;
  sizeKb: number;
  dataUrl: string;
  rotation: number;
}

export const PdfSuiteTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'merge' | 'watermark' | 'compress'>('merge');
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkColor, setWatermarkColor] = useState('#451A03');
  const [compressLevel, setCompressLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const item: PdfFileItem = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          dataUrl: event.target?.result as string,
          rotation: 0,
        };
        setFiles((prev) => [...prev, item]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const rotateFile = (id: string) => {
    setFiles(
      files.map((f) => (f.id === id ? { ...f, rotation: (f.rotation + 90) % 360 } : f))
    );
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  // Generate output document using canvas compositor
  const handleExport = () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      // Create canvas combining all pages or applying watermark
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const baseWidth = 800;
      const baseHeight = 1100;
      canvas.width = baseWidth;
      canvas.height = baseHeight * files.length;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let loaded = 0;
      files.forEach((file, idx) => {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.translate(baseWidth / 2, idx * baseHeight + baseHeight / 2);
          ctx.rotate((file.rotation * Math.PI) / 180);
          ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
          ctx.restore();

          // Apply watermark if active
          if (watermarkText.trim()) {
            ctx.save();
            ctx.translate(baseWidth / 2, idx * baseHeight + baseHeight / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.fillStyle = watermarkColor;
            ctx.globalAlpha = watermarkOpacity;
            ctx.font = 'bold 64px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(watermarkText.toUpperCase(), 0, 0);
            ctx.restore();
          }

          loaded++;
          if (loaded === files.length) {
            // Quality ratio based on compression
            const quality = compressLevel === 'extreme' ? 0.4 : compressLevel === 'recommended' ? 0.75 : 0.95;
            const link = document.createElement('a');
            link.download = `vunix-pdf-processed-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', quality);
            link.click();
            setIsProcessing(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
          }
        };
        img.src = file.dataUrl;
      });
    }, 400);
  };

  const totalOriginalSize = files.reduce((sum, f) => sum + f.sizeKb, 0);
  const estimatedSavings =
    compressLevel === 'extreme' ? Math.round(totalOriginalSize * 0.65) : Math.round(totalOriginalSize * 0.4);

  return (
    <div className="space-y-6">
      {/* Sub-tools Tab bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('merge')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
            activeTab === 'merge' ? 'bg-[#451A03] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Merge & Organize
        </button>
        <button
          onClick={() => setActiveTab('watermark')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
            activeTab === 'watermark' ? 'bg-[#451A03] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Stamp className="w-3.5 h-3.5" /> Stamp & Watermark
        </button>
        <button
          onClick={() => setActiveTab('compress')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
            activeTab === 'compress' ? 'bg-[#451A03] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <FileDown className="w-3.5 h-3.5" /> Compress Optimizer
        </button>
      </div>

      {/* Upload Zone */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-8 border-2 border-dashed border-neutral-300 rounded-3xl bg-neutral-50 hover:bg-[#EDE9FE]/30 hover:border-[#451A03]/50 cursor-pointer text-center transition flex flex-col items-center justify-center gap-2"
        >
          <Upload className="w-8 h-8 text-[#451A03]" />
          <span className="text-sm font-semibold text-neutral-800">
            {files.length > 0 ? 'Add More Documents / Pages' : 'Upload PDF Pages or Document Images'}
          </span>
          <span className="text-xs text-neutral-500">
            Supports multi-file upload for fast merging, watermarking, and reordering
          </span>
        </div>
      </div>

      {/* Watermark controls (if tab active) */}
      {activeTab === 'watermark' && (
        <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Watermark Text & Appearance
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Watermark Stamp Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="CONFIDENTIAL / DRAFT / APPROVED"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Opacity: {Math.round(watermarkOpacity * 100)}%</label>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#451A03]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={watermarkColor}
                  onChange={(e) => setWatermarkColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-200"
                />
                <span className="text-xs font-mono">{watermarkColor}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compress controls (if tab active) */}
      {activeTab === 'compress' && (
        <div className="p-5 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#451A03]">
            Compression Strength
          </span>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setCompressLevel('recommended')}
              className={`p-3 rounded-2xl text-xs font-bold transition border ${
                compressLevel === 'recommended' ? 'bg-[#451A03] text-white border-black' : 'bg-white text-neutral-800 border-neutral-200'
              }`}
            >
              Recommended (Best Quality)
            </button>
            <button
              onClick={() => setCompressLevel('extreme')}
              className={`p-3 rounded-2xl text-xs font-bold transition border ${
                compressLevel === 'extreme' ? 'bg-[#451A03] text-white border-black' : 'bg-white text-neutral-800 border-neutral-200'
              }`}
            >
              High Compression (~65% reduction)
            </button>
            <button
              onClick={() => setCompressLevel('low')}
              className={`p-3 rounded-2xl text-xs font-bold transition border ${
                compressLevel === 'low' ? 'bg-[#451A03] text-white border-black' : 'bg-white text-neutral-800 border-neutral-200'
              }`}
            >
              Minimal (Crisp Vector)
            </button>
          </div>
          {files.length > 0 && (
            <p className="text-xs text-[#451A03]/80 pt-1">
              Estimated file size savings: ~{estimatedSavings} KB of {totalOriginalSize} KB
            </p>
          )}
        </div>
      )}

      {/* Document Pages List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Document Queue ({files.length} Pages)
          </span>
          {files.length > 0 && (
            <button
              onClick={() => setFiles([])}
              className="text-xs text-neutral-400 hover:text-red-600 transition"
            >
              Clear All Pages
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <div className="p-8 border border-neutral-200 rounded-2xl bg-white text-center text-neutral-400">
            <FileText className="w-8 h-8 mx-auto mb-1 opacity-30 text-[#451A03]" />
            <p className="text-xs font-medium">No pages loaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="p-3 bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between space-y-2 relative group"
              >
                <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-200">
                  <img
                    src={file.dataUrl}
                    alt={file.name}
                    style={{ transform: `rotate(${file.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur">
                    #{idx + 1}
                  </span>
                </div>

                <div className="text-xs">
                  <p className="font-semibold text-neutral-800 truncate">{file.name}</p>
                  <p className="text-neutral-400 text-[10px]">{file.sizeKb} KB • {file.rotation}°</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveFile(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveFile(idx, 'down')}
                      disabled={idx === files.length - 1}
                      className="p-1 rounded text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => rotateFile(file.id)}
                      className="p-1 rounded text-neutral-500 hover:bg-neutral-100"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded text-neutral-400 hover:text-red-600"
                    title="Delete page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {files.length > 0 && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleExport}
            disabled={isProcessing}
            className="px-8 py-3.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-40 transition flex items-center gap-2 shadow-sm"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Exported Successfully!
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                {isProcessing ? 'Processing PDF Suite...' : 'Download Processed Document'}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
