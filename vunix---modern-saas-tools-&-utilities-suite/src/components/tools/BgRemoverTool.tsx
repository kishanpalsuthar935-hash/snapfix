import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Wand2, RefreshCw, Eye, Sliders, Check } from 'lucide-react';

export const BgRemoverTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState(30);
  const [invertMask, setInvertMask] = useState(false);
  const [targetBg, setTargetBg] = useState<'transparent' | '#FFFFFF' | '#EDE9FE' | '#451A03' | '#0F172A'>('transparent');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setImageSrc(src);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Perform background cutout on canvas
  const processImage = () => {
    if (!canvasRef.current || !originalImageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = originalImageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Sample background reference colors from 4 corners
    const cornerIndices = [
      0, // top-left
      (canvas.width - 1) * 4, // top-right
      ((canvas.height - 1) * canvas.width) * 4, // bottom-left
      ((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4, // bottom-right
    ];

    const sampleR = (data[cornerIndices[0]] + data[cornerIndices[1]] + data[cornerIndices[2]] + data[cornerIndices[3]]) / 4;
    const sampleG = (data[cornerIndices[0] + 1] + data[cornerIndices[1] + 1] + data[cornerIndices[2] + 1] + data[cornerIndices[3] + 1]) / 4;
    const sampleB = (data[cornerIndices[0] + 2] + data[cornerIndices[1] + 2] + data[cornerIndices[2] + 2] + data[cornerIndices[3] + 2]) / 4;

    const tolDist = (tolerance / 100) * 441; // Max RGB euclidean distance is sqrt(255^2*3) = 441

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const dist = Math.sqrt(
        Math.pow(r - sampleR, 2) + Math.pow(g - sampleG, 2) + Math.pow(b - sampleB, 2)
      );

      const isBg = dist < tolDist;
      const shouldRemove = invertMask ? !isBg : isBg;

      if (shouldRemove) {
        data[i + 3] = 0; // Transparent alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  useEffect(() => {
    if (imageSrc) {
      processImage();
    }
  }, [imageSrc, tolerance, invertMask]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const currentCanvas = canvasRef.current;

    // If targetBg is not transparent, render backdrop
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = currentCanvas.width;
    exportCanvas.height = currentCanvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    if (targetBg !== 'transparent') {
      ctx.fillStyle = targetBg;
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    ctx.drawImage(currentCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = `vunix-cutout-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-neutral-300 rounded-3xl bg-neutral-50 hover:bg-[#EDE9FE]/30 hover:border-[#451A03]/50 cursor-pointer text-center transition flex flex-col items-center justify-center gap-2"
          >
            <Wand2 className="w-8 h-8 text-[#451A03]" />
            <span className="text-sm font-semibold text-neutral-800">
              {imageSrc ? 'Upload Different Subject Image' : 'Upload Image to Extract Subject'}
            </span>
            <span className="text-xs text-neutral-500">
              Works best with portraits, products, logos, and signatures
            </span>
          </div>
        </div>

        {imageSrc && (
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#451A03]" /> Cutout Refinement
            </span>

            <div>
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Color Sensitivity / Tolerance</span>
                <span className="font-mono font-bold text-[#451A03]">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                value={tolerance}
                onChange={(e) => setTolerance(parseInt(e.target.value))}
                className="w-full accent-[#451A03]"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Increase if backdrop remains, decrease if parts of the subject vanish.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={invertMask}
                  onChange={(e) => setInvertMask(e.target.checked)}
                  className="rounded text-[#451A03] focus:ring-[#451A03]"
                />
                <span>Invert Cutout Selection</span>
              </label>

              <button
                onClick={() => {
                  setTolerance(30);
                  setInvertMask(false);
                }}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Replace Background Color */}
            <div className="pt-3 border-t border-neutral-100">
              <span className="block text-xs font-semibold text-neutral-700 mb-2">
                Replace Background:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTargetBg('transparent')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    targetBg === 'transparent' ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  Transparent PNG
                </button>
                <button
                  onClick={() => setTargetBg('#FFFFFF')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    targetBg === '#FFFFFF' ? 'bg-[#451A03] text-white' : 'bg-white text-neutral-800 border-neutral-300'
                  }`}
                >
                  Solid White
                </button>
                <button
                  onClick={() => setTargetBg('#EDE9FE')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    targetBg === '#EDE9FE' ? 'bg-[#451A03] text-white' : 'bg-[#EDE9FE] text-[#451A03] border-[#DDD6FE]'
                  }`}
                >
                  Soft Lilac
                </button>
                <button
                  onClick={() => setTargetBg('#451A03')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    targetBg === '#451A03' ? 'bg-black text-white' : 'bg-[#451A03] text-white'
                  }`}
                >
                  Terracotta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Canvas / Checkerboard Preview */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full p-8 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#451A03]/70 mb-4">
            Alpha Transparency Preview
          </span>

          <div
            className="w-full max-w-sm aspect-square rounded-2xl shadow-inner border border-neutral-300 flex items-center justify-center overflow-hidden transition-all"
            style={{
              backgroundColor: targetBg === 'transparent' ? undefined : targetBg,
              backgroundImage:
                targetBg === 'transparent'
                  ? 'radial-gradient(#CBD5E1 1px, transparent 1px), radial-gradient(#CBD5E1 1px, #F8FAFC 1px)'
                  : undefined,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 8px 8px',
            }}
          >
            {imageSrc ? (
              <canvas ref={canvasRef} className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center text-neutral-400 p-8">
                <Wand2 className="w-10 h-10 mb-2 opacity-30 text-[#451A03]" />
                <p className="text-xs font-medium">Select an image to preview background removal</p>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm mt-6">
            <button
              onClick={handleDownload}
              disabled={!imageSrc}
              className="w-full py-3.5 px-6 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download High-Res Cutout (PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
