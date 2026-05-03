"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { Editor } from './Editor';
import { cn } from '../lib/utils';
import { firebaseConfig } from '../lib/firebase';

type Tool = 'resize' | 'crop' | 'mirror' | 'rotate' | 'compress' | 'convert' | 'pixelate' | 'blackwhite' | 'watermark' | 'metadata';

interface ToolLayoutProps {
  activeTool: Tool;
  content: {
    title: string;
    desc: string;
    benefits: string[];
    seoTitle?: string;
    seoDescription?: string;
  };
}

export function ToolLayout({ activeTool, content }: ToolLayoutProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = useCallback((file: File) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const handleReset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImage(null);
    setImageUrl(null);
  }, [imageUrl]);

  return (
    <>
      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8 rounded-lg shadow-sm border border-yellow-200">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Background Glows */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center mb-16 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-8 shadow-sm"
              >
                <Zap className="w-3 h-3 fill-emerald-600" />
                Professional Image Suite
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.05] gradient-text">
                {content.title}
              </h1>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                {content.desc}
              </p>
            </div>
            
            <div className="relative group max-w-5xl mx-auto">
              <UploadZone onUpload={handleUpload} />
            </div>

            {/* Informational Sections */}
            <div className="mt-20 space-y-20">
              <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 glass-effect p-12 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 brand-gradient opacity-[0.05] blur-3xl -mr-32 -mt-32" />
                  <h2 className="text-4xl font-black mb-8 gradient-text tracking-tight">Why choose ImageToolLab?</h2>
                  <p className="text-slate-500 leading-relaxed mb-10 text-lg font-medium">
                    Experience the pinnacle of browser-based image editing. We combine high-performance processing with an uncompromising commitment to your privacy.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.benefits.map((item, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ y: -2, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                        className="flex items-center gap-4 text-sm font-bold text-slate-800 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-5 rounded-[2.5rem] border border-slate-200 overflow-hidden relative group bg-white shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="w-full aspect-square rounded-3xl border border-slate-100 flex items-center justify-center relative bg-slate-50/50 backdrop-blur-sm">
                      <div className="w-28 h-28 brand-gradient rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 relative z-10">
                        <div className="w-14 h-14 border-[5px] border-white/20 rounded-full border-t-white animate-spin" />
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-slate-200 rounded-tl-xl" />
                      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-slate-200 rounded-br-xl" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="text-center max-w-5xl mx-auto">
                <h2 className="text-4xl font-black mb-20 gradient-text tracking-tight">The Creative Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: "01", title: "Import", desc: "Drag your high-resolution assets into our secure workspace.", color: "from-emerald-500 to-teal-500" },
                    { step: "02", title: "Refine", desc: "Apply professional-grade transformations with real-time feedback.", color: "from-teal-500 to-lime-500" },
                    { step: "03", title: "Export", desc: "Download your optimized masterpiece in any format instantly.", color: "from-lime-500 to-emerald-500" }
                  ].map((item, i) => (
                    <div key={i} className="glass-effect p-12 rounded-[2.5rem] relative group hover:bg-white transition-all hover:-translate-y-2">
                      <span className={cn("inline-flex items-center justify-center w-14 h-14 rounded-2xl font-black text-white shadow-xl mb-8 text-lg bg-gradient-to-br", item.color)}>
                        {item.step}
                      </span>
                      <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Editor 
              image={image} 
              imageUrl={imageUrl!} 
              onReset={handleReset} 
              initialTool={activeTool}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
