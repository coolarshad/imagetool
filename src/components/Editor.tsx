import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Maximize, 
  Crop, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Download, 
  Settings, 
  FileJson, 
  Image as ImageIcon,
  Check,
  ChevronRight,
  Info,
  Layers,
  Palette,
  Zap,
  Loader2,
  Grid3X3,
  Contrast,
  Undo2,
  Redo2,
  Type,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  Menu,
  X,
  LayoutGrid
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';

interface EditorProps {
  image: File;
  imageUrl: string;
  onReset: () => void;
  initialTool?: Tool;
}

type Tool = 'resize' | 'crop' | 'mirror' | 'rotate' | 'compress' | 'convert' | 'pixelate' | 'blackwhite' | 'watermark' | 'metadata';

export function Editor({ image, imageUrl, onReset, initialTool = 'resize' }: EditorProps) {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<Tool>(initialTool);
  const [showSidebar, setShowSidebar] = useState(true);
  const [_0x_pr, setIsProcessing] = useState(false);

  // History state for Undo/Redo
  const [history, setHistory] = useState<string[]>([imageUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    setActiveTool(initialTool);
  }, [initialTool]);

  const handleToolChange = (toolId: Tool) => {
    setActiveTool(toolId);
    router.push(`/${toolId}-image`);
  };
  const [_0x_dim, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [_0x_url, setEditedImageUrlState] = useState<string>(imageUrl);

  // Memory management: Revoke old URLs
  const setEditedImageUrl = useCallback((newUrl: string, addToHistory = true) => {
    setEditedImageUrlState(newUrl);

    if (addToHistory) {
      setHistoryIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        return nextIndex > 19 ? 19 : nextIndex;
      });
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        const updated = [...newHistory, newUrl];
        // Limit history to 20 steps to save memory
        if (updated.length > 20) {
          const removed = updated.shift();
          if (removed && removed !== imageUrl) URL.revokeObjectURL(removed);
        }
        return updated;
      });
    }
  }, [historyIndex, imageUrl]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setEditedImageUrlState(history[prevIndex]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setEditedImageUrlState(history[nextIndex]);
    }
  }, [historyIndex, history]);

  // Cleanup on unmount
  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    return () => {
      historyRef.current.forEach(url => {
        if (url !== imageUrl) URL.revokeObjectURL(url);
      });
    };
  }, [imageUrl]);
  
  // Resize state
  const [resize, setResize] = useState({ width: 0, height: 0, percentage: 100, mode: 'pixels' as 'pixels' | 'percentage', aspectLocked: true });
  
  // Crop state
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType>();
  const imgRef = useRef<HTMLImageElement>(null);

  // Rotate state
  const [rotation, setRotation] = useState({ angle: 0, enlargeCanvas: true });

  // Pixelate state
  const [pixelSize, setPixelSize] = useState(10);

  // Black/White state
  const [bwMode, setBwMode] = useState<'grayscale' | 'binary'>('grayscale');
  const [threshold, setThreshold] = useState(128);
  const [grayscaleIntensity, setGrayscaleIntensity] = useState(100);

  // Convert state
  const [format, setFormat] = useState<'jpg' | 'png' | 'webp' | 'bmp' | 'gif' | 'tiff'>('png');

  // Compress state
  const [quality, setQuality] = useState(0.8);
  const [targetSize, setTargetSize] = useState(500);
  const [targetSizeUnit, setTargetSizeUnit] = useState<'KB' | 'MB'>('KB');
  const [useTargetSize, setUseTargetSize] = useState(false);

  // Watermark state
  const [watermarkText, setWatermarkText] = useState('ImageToolLab');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkSize, setWatermarkSize] = useState(40);
  const [watermarkPosition, setWatermarkPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');

  // Metadata state
  const [stripMetadata, setStripMetadata] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setResize(prev => ({ ...prev, width: img.width, height: img.height }));
    };
    img.src = _0x_url;
  }, [_0x_url]);

  const handleResizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = parseInt(value) || 0;
    
    if (resize.mode === 'percentage') {
      const p = Math.min(Math.max(val, 1), 500);
      setResize(prev => ({ 
        ...prev, 
        percentage: p,
        width: Math.round(_0x_dim.width * (p / 100)),
        height: Math.round(_0x_dim.height * (p / 100))
      }));
      return;
    }

    if (resize.aspectLocked) {
      const ratio = _0x_dim.width / _0x_dim.height;
      if (name === 'width') {
        setResize(prev => ({ ...prev, width: val, height: Math.round(val / ratio) }));
      } else {
        setResize(prev => ({ ...prev, height: val, width: Math.round(val * ratio) }));
      }
    } else {
      setResize(prev => ({ ...prev, [name]: val }));
    }
  };

  const _0x_r = async () => {
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      // Canvas Limit Check
      const MAX_CANVAS_SIZE = 16384; // Typical browser limit
      if (resize.width > MAX_CANVAS_SIZE || resize.height > MAX_CANVAS_SIZE) {
        throw new Error(`Image dimensions exceed browser limits (${MAX_CANVAS_SIZE}px)`);
      }

      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = _0x_url;
      await new Promise(resolve => img.onload = resolve);
      
      canvas.width = resize.width;
      canvas.height = resize.height;
      ctx?.drawImage(img, 0, 0, resize.width, resize.height);
      
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_c = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
        setCrop(undefined);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_rt = async (angleOverride?: number) => {
    setIsProcessing(true);
    try {
      const angle = angleOverride !== undefined ? angleOverride : rotation.angle;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = _0x_url;
      await new Promise(resolve => img.onload = resolve);

      const rad = (angle * Math.PI) / 180;
      
      if (rotation.enlargeCanvas) {
        canvas.width = Math.abs(img.width * Math.cos(rad)) + Math.abs(img.height * Math.sin(rad));
        canvas.height = Math.abs(img.width * Math.sin(rad)) + Math.abs(img.height * Math.cos(rad));
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx?.translate(canvas.width / 2, canvas.height / 2);
      ctx?.rotate(rad);
      ctx?.drawImage(img, -img.width / 2, -img.height / 2);

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
        if (angleOverride === undefined) setRotation(prev => ({ ...prev, angle: 0 }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_m = async (mode: 'horizontal' | 'vertical') => {
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = _0x_url;
      await new Promise(resolve => img.onload = resolve);

      canvas.width = img.width;
      canvas.height = img.height;

      if (mode === 'horizontal') {
        ctx?.translate(canvas.width, 0);
        ctx?.scale(-1, 1);
      } else {
        ctx?.translate(0, canvas.height);
        ctx?.scale(1, -1);
      }

      ctx?.drawImage(img, 0, 0);

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_p = async () => {
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = _0x_url;
      await new Promise(resolve => img.onload = resolve);

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw small
      const smallWidth = Math.max(1, Math.floor(img.width / pixelSize));
      const smallHeight = Math.max(1, Math.floor(img.height / pixelSize));
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = smallWidth;
      tempCanvas.height = smallHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx?.drawImage(img, 0, 0, smallWidth, smallHeight);
      
      // Draw back large
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, smallWidth, smallHeight, 0, 0, canvas.width, canvas.height);
      }

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_bw = async () => {
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = _0x_url;
      await new Promise(resolve => img.onload = resolve);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const data = imageData.data;
        const intensity = grayscaleIntensity / 100;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const avg = (r + g + b) / 3;
          
          if (bwMode === 'binary') {
            const val = avg > threshold ? 255 : 0;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
          } else {
            // Grayscale with intensity blending
            data[i] = r + (avg - r) * intensity;
            data[i + 1] = g + (avg - g) * intensity;
            data[i + 2] = b + (avg - b) * intensity;
          }
        }
        ctx?.putImageData(imageData, 0, 0);
      }

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_wm = async () => {
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = _0x_url;
      await new Promise(resolve => img.onload = resolve);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      if (ctx) {
        const fontSize = (img.width * watermarkSize) / 1000;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let x = canvas.width / 2;
        let y = canvas.height / 2;

        if (watermarkPosition === 'bottom-right') {
          x = canvas.width - fontSize * 2;
          y = canvas.height - fontSize;
          ctx.textAlign = 'right';
        } else if (watermarkPosition === 'bottom-left') {
          x = fontSize * 2;
          y = canvas.height - fontSize;
          ctx.textAlign = 'left';
        } else if (watermarkPosition === 'top-right') {
          x = canvas.width - fontSize * 2;
          y = fontSize * 2;
          ctx.textAlign = 'right';
        } else if (watermarkPosition === 'top-left') {
          x = fontSize * 2;
          y = fontSize * 2;
          ctx.textAlign = 'left';
        }

        ctx.fillText(watermarkText, x, y);
      }

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_sm = async () => {
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = _0x_url;
      await new Promise(resolve => img.onload = resolve);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // toBlob naturally strips EXIF metadata as it only encodes pixel data
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${format}`));
      if (blob) {
        setEditedImageUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const _0x_d = () => {
    const link = document.createElement('a');
    link.download = `imagetoollab-edited.${format}`;
    link.href = _0x_url;
    link.click();
  };

  const tools = [
    { id: 'resize', name: 'Resize', icon: Maximize, color: 'bg-black', accent: 'text-black' },
    { id: 'crop', name: 'Crop', icon: Crop, color: 'bg-black', accent: 'text-black' },
    { id: 'mirror', name: 'Mirror', icon: FlipHorizontal, color: 'bg-black', accent: 'text-black' },
    { id: 'rotate', name: 'Rotate', icon: RotateCw, color: 'bg-black', accent: 'text-black' },
    { id: 'compress', name: 'Compress', icon: Zap, color: 'bg-black', accent: 'text-black' },
    { id: 'convert', name: 'Convert', icon: FileJson, color: 'bg-black', accent: 'text-black' },
    { id: 'watermark', name: 'Watermark', icon: Type, color: 'bg-black', accent: 'text-black' },
    { id: 'metadata', name: 'Metadata', icon: ShieldOff, color: 'bg-black', accent: 'text-black' },
    { id: 'pixelate', name: 'Pixelate', icon: Grid3X3, color: 'bg-black', accent: 'text-black' },
    { id: 'blackwhite', name: 'Black/White', icon: Contrast, color: 'bg-black', accent: 'text-black' },
  ];

  const activeToolData = tools.find(t => t.id === activeTool)!;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-[1600px] mx-auto">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {showSidebar ? (
          <motion.aside 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="w-full lg:w-80 flex-shrink-0 space-y-6 z-30"
          >
            <div className="glass-effect rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-emerald-500/20")}>
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-900">Tools</h3>
                </div>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                  title="Minimize Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-3 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 bg-white no-scrollbar">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolChange(tool.id as Tool)}
                    className={cn(
                      "flex flex-col lg:flex-row items-center gap-2 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl text-[10px] lg:text-sm font-black transition-all duration-300 group relative overflow-hidden flex-shrink-0 min-w-[70px] lg:min-w-0",
                      activeTool === tool.id 
                        ? "bg-slate-900 text-white shadow-xl scale-[1.02]" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <tool.icon className={cn(
                      "w-5 h-5 lg:w-6 lg:h-6 transition-all duration-300 group-hover:scale-110",
                      activeTool === tool.id ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                    )} />
                    <span className="tracking-tight whitespace-nowrap">{tool.name}</span>
                    {activeTool === tool.id && (
                      <motion.div 
                        layoutId="active-pill"
                        className="hidden lg:block absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Card - Hidden on mobile when sidebar is visible to save space */}
            <div className="hidden lg:block brand-gradient p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <h5 className="text-white font-black mb-4 flex items-center gap-3 uppercase tracking-[0.3em] text-[10px] relative z-10">
                <Zap className="w-4 h-4 fill-white" />
                Edge Processing
              </h5>
              <p className="text-white/90 text-xs leading-relaxed font-bold tracking-tight relative z-10">
                ImageToolLab leverages advanced browser-side acceleration for instantaneous results.
              </p>
            </div>
          </motion.aside>
        ) : (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full brand-gradient text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 lg:relative lg:bottom-0 lg:left-0 lg:w-16 lg:h-16 lg:rounded-3xl"
            onClick={() => setShowSidebar(true)}
            title="Show Tools"
          >
            <LayoutGrid className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Preview Area */}
      <div className="flex-1 w-full space-y-6">
        <div className="glass-effect rounded-[2.5rem] p-6 md:p-12 min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] group bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:32px_32px]" />
          
          {/* Undo/Redo Controls - Canvas Overlay */}
          <div className="absolute top-8 left-8 z-20 flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl">
            <button 
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 disabled:opacity-30 transition-all active:scale-95"
              title="Undo"
            >
              <Undo2 className="w-4 h-4 text-slate-900" />
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 disabled:opacity-30 transition-all active:scale-95"
              title="Redo"
            >
              <Redo2 className="w-4 h-4 text-slate-900" />
            </button>
          </div>
          
          <div className="relative max-w-full max-h-[80vh] flex items-center justify-center z-10">
            {activeTool === 'crop' ? (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                className="rounded-none overflow-hidden shadow-none border-2 border-black"
              >
                <img
                  ref={imgRef}
                  src={_0x_url}
                  alt="Preview"
                  className="max-w-full max-h-[80vh] object-contain"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </ReactCrop>
            ) : (
              <div className="relative">
                <img
                  src={_0x_url}
                  alt="Preview"
                  className="max-w-full max-h-[80vh] object-contain rounded-none shadow-none border-2 border-black transition-transform duration-700 group-hover:scale-[1.01]"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
                {activeTool === 'watermark' && watermarkText && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: watermarkOpacity }}
                    className={cn(
                      "absolute pointer-events-none font-black select-none transition-all duration-300 whitespace-nowrap",
                      watermarkPosition === 'center' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center",
                      watermarkPosition === 'bottom-right' && "bottom-[10%] right-[10%] text-right",
                      watermarkPosition === 'bottom-left' && "bottom-[10%] left-[10%] text-left",
                      watermarkPosition === 'top-right' && "top-[10%] right-[10%] text-right",
                      watermarkPosition === 'top-left' && "top-[10%] left-[10%] text-left"
                    )}
                    style={{ 
                      fontSize: `${watermarkSize / 2}px`,
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.8)'
                    }}
                  >
                    {watermarkText}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {_0x_pr && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-stone-50 border-t-brand-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-brand-primary animate-pulse" />
                  </div>
                </div>
                <span className="text-stone-900 font-black tracking-[0.4em] uppercase text-[10px]">Optimizing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Tool Settings */}
        <div className="glass-effect rounded-[2.5rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" />
                <h4 className="font-black text-slate-900 capitalize tracking-tight text-lg">{activeTool}</h4>
              </div>

              {activeTool === 'resize' && (
                <div className="space-y-6">
                  <div className="flex p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
                    <button 
                      onClick={() => setResize(prev => ({ ...prev, mode: 'pixels' }))}
                      className={cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", resize.mode === 'pixels' ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-slate-900")}
                    >
                      Pixels
                    </button>
                    <button 
                      onClick={() => setResize(prev => ({ ...prev, mode: 'percentage' }))}
                      className={cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", resize.mode === 'percentage' ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-slate-900")}
                    >
                      Percentage
                    </button>
                  </div>

                  {resize.mode === 'pixels' ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Width</label>
                        <input
                          type="number"
                          name="width"
                          value={resize.width}
                          onChange={handleResizeChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all focus:bg-white text-slate-900"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Height</label>
                        <input
                          type="number"
                          name="height"
                          value={resize.height}
                          onChange={handleResizeChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all focus:bg-white text-slate-900"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Percentage</label>
                        <span className="text-sm font-black text-slate-900">{resize.percentage}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="200"
                        step="1"
                        value={resize.percentage}
                        onChange={(e) => handleResizeChange({ target: { name: 'percentage', value: e.target.value } } as any)}
                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      />
                      <input
                        type="number"
                        name="percentage"
                        value={resize.percentage}
                        onChange={handleResizeChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all focus:bg-white text-slate-900"
                        />
                    </div>
                  )}

                  {resize.mode === 'pixels' && (
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={resize.aspectLocked}
                          onChange={(e) => setResize(prev => ({ ...prev, aspectLocked: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={cn("w-12 h-6 rounded-full transition-all duration-300", resize.aspectLocked ? "bg-emerald-500" : "bg-slate-200")} onClick={() => setResize(prev => ({ ...prev, aspectLocked: !prev.aspectLocked }))} />
                        <div className={cn("absolute left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm pointer-events-none", resize.aspectLocked ? "translate-x-6" : "translate-x-0")} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-all">Lock Aspect Ratio</span>
                    </label>
                  )}

                  <button
                    onClick={_0x_r}
                    disabled={_0x_pr}
                    className="w-full brand-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px]"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Apply Resize</>}
                  </button>
                </div>
              )}

              {activeTool === 'crop' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                      Select the desired area by dragging directly on the image preview.
                    </p>
                  </div>
                  <button
                    onClick={_0x_c}
                    disabled={!completedCrop || _0x_pr}
                    className="w-full brand-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Crop className="w-4 h-4" /> Apply Crop</>}
                  </button>
                </div>
              )}

              {activeTool === 'mirror' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => _0x_m('horizontal')} 
                      className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-100 transition-all duration-300 flex flex-col items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FlipHorizontal className="w-6 h-6 text-slate-900" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">Horizontal</span>
                    </button>
                    <button 
                      onClick={() => _0x_m('vertical')} 
                      className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-100 transition-all duration-300 flex flex-col items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FlipVertical className="w-6 h-6 text-slate-900" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">Vertical</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTool === 'rotate' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => _0x_rt(90)} 
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all duration-300 flex flex-col items-center gap-2 group"
                    >
                      <RotateCw className="w-5 h-5 text-emerald-500 group-hover:rotate-90 transition-all duration-300" />
                      <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900">90°</span>
                    </button>
                    <button 
                      onClick={() => _0x_rt(-90)} 
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all duration-300 flex flex-col items-center gap-2 group"
                    >
                      <RotateCw className="w-5 h-5 text-emerald-500 scale-x-[-1] group-hover:-rotate-90 transition-all duration-300" />
                      <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900">-90°</span>
                    </button>
                    <button 
                      onClick={() => _0x_rt(180)} 
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all duration-300 flex flex-col items-center gap-2 group"
                    >
                      <RotateCw className="w-5 h-5 text-emerald-500 group-hover:rotate-180 transition-all duration-300" />
                      <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900">180°</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Custom Angle</label>
                      <span className="text-sm font-black text-slate-900">{rotation.angle}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={rotation.angle}
                      onChange={(e) => setRotation(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={rotation.enlargeCanvas}
                        onChange={(e) => setStripMetadata(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={cn("w-12 h-6 rounded-none transition-all duration-300", rotation.enlargeCanvas ? "bg-black" : "bg-stone-200")} onClick={() => setRotation(prev => ({ ...prev, enlargeCanvas: !prev.enlargeCanvas }))} />
                      <div className={cn("absolute left-1 w-4 h-4 rounded-none bg-white transition-all duration-300 shadow-none pointer-events-none", rotation.enlargeCanvas ? "translate-x-6" : "translate-x-0")} />
                    </div>
                    <span className="text-xs font-bold text-black group-hover:underline transition-all">Enlarge Background</span>
                  </label>

                  <button
                    onClick={() => _0x_rt()}
                    disabled={_0x_pr || rotation.angle === 0}
                    className="w-full bg-black text-white font-black uppercase tracking-widest py-4 rounded-none transition-all hover:bg-stone-800 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RotateCw className="w-4 h-4" /> Rotate Image</>}
                  </button>
                </div>
              )}

              {activeTool === 'convert' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-3">
                    {['png', 'jpg', 'webp', 'bmp', 'gif', 'tiff'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f as any)}
                        className={cn(
                          "px-6 py-4 rounded-none text-[10px] font-black uppercase tracking-widest text-left transition-all duration-300",
                          format === f 
                            ? "bg-black text-white shadow-none scale-[1.02]" 
                            : "bg-white text-black hover:bg-stone-100 border-2 border-black"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 rounded-none border-2 border-black bg-stone-50 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-3 text-black">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Optimization Tip</span>
                    </div>
                    <p className="text-xs text-black leading-relaxed font-bold tracking-tight">
                      WEBP is highly recommended for modern web applications, offering superior compression without quality loss.
                    </p>
                  </div>
                </div>
              )}

              {activeTool === 'compress' && (
                <div className="space-y-8">
                  <div className="flex p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
                    <button 
                      onClick={() => setUseTargetSize(false)}
                      className={cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", !useTargetSize ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-slate-900")}
                    >
                      By Quality
                    </button>
                    <button 
                      onClick={() => setUseTargetSize(true)}
                      className={cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", useTargetSize ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-slate-900")}
                    >
                      By Size
                    </button>
                  </div>

                  {!useTargetSize ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Quality</label>
                        <span className="text-sm font-black text-slate-900">{Math.round(quality * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Target Size</label>
                        <div className="flex gap-1">
                          {['KB', 'MB'].map(unit => (
                            <button
                              key={unit}
                              onClick={() => setTargetSizeUnit(unit as any)}
                              className={cn("px-3 py-1 text-[10px] rounded-lg font-bold transition-all", targetSizeUnit === unit ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500")}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="number"
                        value={targetSize}
                        onChange={(e) => setTargetSize(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white text-slate-900 transition-all"
                        placeholder={`Enter size in ${targetSizeUnit}`}
                      />
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      setIsProcessing(true);
                      try {
                        const options: any = {
                          maxWidthOrHeight: 1920,
                          useWebWorker: true,
                        };

                        if (useTargetSize) {
                          options.maxSizeMB = targetSizeUnit === 'KB' ? targetSize / 1024 : targetSize;
                        } else {
                          options.initialQuality = quality;
                          options.maxSizeMB = 1; // Default fallback
                        }

                        const compressedFile = await imageCompression(image, options);
                        setEditedImageUrl(URL.createObjectURL(compressedFile));
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    disabled={_0x_pr}
                    className="w-full brand-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> Apply Compression</>}
                  </button>
                </div>
              )}

              {activeTool === 'watermark' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white text-slate-900 transition-all"
                      placeholder="Enter text..."
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Opacity</label>
                      <span className="text-sm font-black text-slate-900">{Math.round(watermarkOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Scale</label>
                      <span className="text-sm font-black text-slate-900">{watermarkSize}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={watermarkSize}
                      onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Position</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'].map(pos => (
                        <button
                          key={pos}
                          onClick={() => setWatermarkPosition(pos as any)}
                          className={cn(
                            "py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border border-slate-200",
                            watermarkPosition === pos ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={_0x_wm}
                    disabled={_0x_pr}
                    className="w-full brand-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px]"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Type className="w-4 h-4" /> Apply Watermark</>}
                  </button>
                </div>
              )}

              {activeTool === 'metadata' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm tracking-tight">Privacy Guard</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Images often contain hidden EXIF data like GPS coordinates, camera settings, and timestamps.
                    </p>
                  </div>
                  <label className="flex items-center gap-4 cursor-pointer group p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={stripMetadata}
                        onChange={(e) => setStripMetadata(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={cn("w-12 h-6 rounded-full transition-all duration-300", stripMetadata ? "bg-emerald-500" : "bg-slate-200")} />
                      <div className={cn("absolute left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm pointer-events-none", stripMetadata ? "translate-x-6" : "translate-x-0")} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-all">Strip All EXIF Data</span>
                  </label>
                  <button
                    onClick={_0x_sm}
                    disabled={_0x_pr || !stripMetadata}
                    className="w-full brand-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px]"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldOff className="w-4 h-4" /> Clean Metadata</>}
                  </button>
                </div>
              )}

              {activeTool === 'pixelate' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Pixel Size</label>
                      <span className="text-sm font-black text-slate-900">{pixelSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="50"
                      step="1"
                      value={pixelSize}
                      onChange={(e) => setPixelSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <button
                    onClick={_0x_p}
                    disabled={_0x_pr}
                    className="w-full brand-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Grid3X3 className="w-4 h-4" /> Apply Pixelate</>}
                  </button>
                </div>
              )}

              {activeTool === 'blackwhite' && (
                <div className="space-y-6">
                  <div className="flex p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
                    <button 
                      onClick={() => setBwMode('grayscale')}
                      className={cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", bwMode === 'grayscale' ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-slate-900")}
                    >
                      Grayscale
                    </button>
                    <button 
                      onClick={() => setBwMode('binary')}
                      className={cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", bwMode === 'binary' ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-slate-900")}
                    >
                      Binary (B&W)
                    </button>
                  </div>

                  {bwMode === 'grayscale' ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Intensity</label>
                        <span className="text-sm font-black text-slate-900">{grayscaleIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={grayscaleIntensity}
                        onChange={(e) => setGrayscaleIntensity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Threshold</label>
                        <span className="text-sm font-black text-slate-900">{threshold}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        step="1"
                        value={threshold}
                        onChange={(e) => setThreshold(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={_0x_bw}
                    disabled={_0x_pr}
                    className="w-full brand-gradient text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-[10px] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {_0x_pr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Contrast className="w-4 h-4" /> Apply {bwMode === 'grayscale' ? 'Grayscale' : 'Black/White'}</>}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-6 p-6 md:p-10 glass-effect rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] bg-white">
          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <div className="space-y-2 md:space-y-3">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Resolution</span>
              <p className="text-xs md:text-sm font-black text-slate-900 font-mono flex items-center gap-2 md:gap-3">
                <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                {_0x_dim.width} × {_0x_dim.height} px
              </p>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200" />
            <div className="space-y-2 md:space-y-3">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Extension</span>
              <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 md:gap-3">
                <FileJson className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                {format}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
            <button
              onClick={onReset}
              className="flex-1 md:flex-none px-6 md:px-10 py-4 md:py-5 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-2xl transition-all active:scale-95"
            >
              Discard
            </button>
            <button
              onClick={_0x_d}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 md:gap-4 px-8 md:px-12 py-4 md:py-5 text-white brand-gradient text-[10px] font-black uppercase tracking-widest rounded-2xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
