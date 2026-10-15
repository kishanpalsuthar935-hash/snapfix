import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCw, ZoomIn, Grid, Image as ImageIcon, Sliders } from 'lucide-react';

interface Preset {
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

const PRESETS: Preset[] = [
  { name: 'US / Intl Passport (2x2")', widthMm: 51, heightMm: 51, description: '51 x 51 mm (2 x 2 inches)' },
  { name: 'Indian / UK Passport', widthMm: 35, heightMm: 45, description: '35 x 45 mm (Standard)' },
  { name: 'Schengen / European Visa', widthMm: 35, heightMm: 45, description: '35 x 45 mm (80% face area)' },
  { name: 'Student / Employee Badge', widthMm: 30, heightMm: 40, description: '30 x 40 mm (Compact ID)' },
  { name: 'Stamp Size Photo', widthMm: 25, heightMm: 30, description: '25 x 30 mm' },
];

export const IdPhotoResizerTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [bgTint, setBgTint] = useState('#FFFFFF');
  const [exportMode, setExportMode] = useState<'single' | 'sheet'>('single');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImageSrc(src);
        setZoom(1);
        setPanX(0);
        setPanY(0);
        setRotation(0);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Render single preview
  useEffect(() => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions scaled to preview
    const previewScale = 6; // px per mm
    const w = selectedPreset.widthMm * previewScale;
    const h = selectedPreset.heightMm * previewScale;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = bgTint;
    ctx.fillRect(0, 0, w, h);

    // Save and apply transformations
    ctx.save();
    ctx.translate(w / 2 + panX, h / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered
    const img = imgRef.current;
    const scaleFactor = Math.max(w / img.width, h / img.height);
    const drawW = img.width * scaleFactor;
    const drawH = img.height * scaleFactor;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    // Draw light cutting border
    ctx.strokeStyle = '#D4D4D8';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);
  }, [imageSrc, selectedPreset, zoom, panX, panY, rotation, bgTint]);

  const handleDownload = () => {
    if (!imgRef.current) return;

    // 300 DPI calculations: 1 mm = 11.811 pixels at 300 DPI
    const dpiScale = 11.811;

    if (exportMode === 'single') {
      const exportCanvas = document.createElement('canvas');
      const w = Math.round(selectedPreset.widthMm * dpiScale);
      const h = Math.round(selectedPreset.heightMm * dpiScale);
      exportCanvas.width = w;
      exportCanvas.height = h;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = bgTint;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      const scaleMultiplier = dpiScale / 6;
      ctx.translate(w / 2 + panX * scaleMultiplier, h / 2 + panY * scaleMultiplier);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const img = imgRef.current;
      const scaleFactor = Math.max(w / img.width, h / img.height);
      const drawW = img.width * scaleFactor;
      const drawH = img.height * scaleFactor;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const link = document.createElement('a');
      link.download = `vunix-id-photo-300dpi-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL('image/png', 1.0);
      link.click();
    } else {
      // 4x6 inch photo paper at 300 DPI = 1200 x 1800 px (or 1800 x 1200)
      const sheetCanvas = document.createElement('canvas');
      sheetCanvas.width = 1800;
      sheetCanvas.height = 1200;
      const sCtx = sheetCanvas.getContext('2d');
      if (!sCtx) return;

      sCtx.fillStyle = '#FFFFFF';
      sCtx.fillRect(0, 0, 1800, 1200);

      // Single rendered image
      const singleCanvas = document.createElement('canvas');
      const w = Math.round(selectedPreset.widthMm * dpiScale);
      const h = Math.round(selectedPreset.heightMm * dpiScale);
      singleCanvas.width = w;
      singleCanvas.height = h;
      const sSingleCtx = singleCanvas.getContext('2d');
      if (sSingleCtx) {
        sSingleCtx.fillStyle = bgTint;
        sSingleCtx.fillRect(0, 0, w, h);
        sSingleCtx.save();
        const scaleMultiplier = dpiScale / 6;
        sSingleCtx.translate(w / 2 + panX * scaleMultiplier, h / 2 + panY * scaleMultiplier);
        sSingleCtx.rotate((rotation * Math.PI) / 180);
        sSingleCtx.scale(zoom, zoom);
        const img = imgRef.current;
        const scaleFactor = Math.max(w / img.width, h / img.height);
        sSingleCtx.drawImage(img, -img.width * scaleFactor / 2, -img.height * scaleFactor / 2, img.width * scaleFactor, img.height * scaleFactor);
        sSingleCtx.restore();
        sSingleCtx.strokeStyle = '#E4E4E7';
        sSingleCtx.lineWidth = 2;
        sSingleCtx.strokeRect(0, 0, w, h);
      }

      // Draw grid of 6 or 8 photos
      const cols = 3;
      const rows = 2;
      const gapX = (1800 - cols * w) / (cols + 1);
      const gapY = (1200 - rows * h) / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = gapX + c * (w + gapX);
          const y = gapY + r * (h + gapY);
          sCtx.drawImage(singleCanvas, x, y);
        }
      }

      const link = document.createElement('a');
      link.download = `vunix-id-print-sheet-4x6-${Date.now()}.jpg`;
      link.href = sheetCanvas.toDataURL('image/jpeg', 0.95);
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-6">
        {/* Presets selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Standard Passport & Visa Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset)}
                className={`p-3 rounded-2xl text-left border transition ${
                  selectedPreset.name === preset.name
                    ? 'border-[#451A03] bg-[#451A03] text-white shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="text-xs font-bold">{preset.name}</div>
                <div className={`text-[11px] mt-0.5 ${selectedPreset.name === preset.name ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Dropzone - Clean & blank by default */}
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
            <Upload className="w-8 h-8 text-[#451A03]" />
            <span className="text-sm font-semibold text-neutral-800">
              {imageSrc ? 'Change / Upload New Photo' : 'Upload Portrait Photo'}
            </span>
            <span className="text-xs text-neutral-500">
              Supports JPG, PNG, WEBP from your device or camera
            </span>
          </div>
        </div>

        {/* Adjustments */}
        {imageSrc && (
          <div className="p-5 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#451A03]" /> Photo Positioning & Zoom
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Zoom Level</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#451A03]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span>Horizontal Pan</span>
                    <span>{panX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={panX}
                    onChange={(e) => setPanX(parseInt(e.target.value))}
                    className="w-full accent-[#451A03]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span>Vertical Pan</span>
                    <span>{panY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={panY}
                    onChange={(e) => setPanY(parseInt(e.target.value))}
                    className="w-full accent-[#451A03]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-700 flex items-center gap-1.5 transition"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate 90° ({rotation}°)
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Backdrop:</span>
                  {['#FFFFFF', '#E0F2FE', '#F3F4F6', '#FEF3C7'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgTint(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border ${
                        bgTint === color ? 'ring-2 ring-[#451A03] scale-110' : 'border-neutral-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Canvas Preview */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full p-8 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#451A03]/70 mb-2">
            300 DPI Official Spec Canvas
          </span>
          <span className="text-xs font-semibold text-[#451A03] mb-4">
            {selectedPreset.name} ({selectedPreset.widthMm} x {selectedPreset.heightMm} mm)
          </span>

          <div className="p-4 bg-white rounded-2xl shadow-sm flex items-center justify-center min-h-[300px]">
            {imageSrc ? (
              <canvas
                ref={canvasRef}
                className="rounded shadow-md max-w-full max-h-[360px] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-neutral-400 p-8">
                <ImageIcon className="w-12 h-12 mb-2 opacity-30 text-[#451A03]" />
                <p className="text-xs font-medium text-neutral-600">No photo uploaded yet</p>
                <p className="text-[11px] text-neutral-400 mt-1">Upload an image on the left to crop & resize</p>
              </div>
            )}
          </div>

          {/* Export Mode Toggle */}
          <div className="w-full mt-6 space-y-3">
            <div className="flex p-1 bg-white/70 rounded-2xl border border-neutral-200">
              <button
                onClick={() => setExportMode('single')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  exportMode === 'single' ? 'bg-[#451A03] text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Single Photo (300 DPI)
              </button>
              <button
                onClick={() => setExportMode('sheet')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                  exportMode === 'sheet' ? 'bg-[#451A03] text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> 6x Print Sheet (4x6")
              </button>
            </div>

            <button
              onClick={handleDownload}
              disabled={!imageSrc}
              className="w-full py-3.5 px-6 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              {exportMode === 'single' ? 'Download 300 DPI Photo' : 'Download Printable 4x6" Sheet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
