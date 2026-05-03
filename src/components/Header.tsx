"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Aperture, RotateCcw, Github, Menu, X, ChevronDown, Zap, Maximize, Crop, FlipHorizontal, RotateCw, FileJson, Type, ShieldOff, Grid3X3, Contrast } from 'lucide-react';
import { cn } from '../lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { name: 'Resize', path: '/resize-image', icon: Maximize, desc: 'Change dimensions' },
  { name: 'Crop', path: '/crop-image', icon: Crop, desc: 'Frame your image' },
  { name: 'Mirror', path: '/mirror-image', icon: FlipHorizontal, desc: 'Flip & reflect' },
  { name: 'Rotate', path: '/rotate-image', icon: RotateCw, desc: 'Spin & tilt' },
  { name: 'Compress', path: '/compress-image', icon: Zap, desc: 'Reduce file size' },
  { name: 'Convert', path: '/convert-image', icon: FileJson, desc: 'Change formats' },
  { name: 'Watermark', path: '/watermark-image', icon: Type, desc: 'Add text overlay' },
  { name: 'Metadata', path: '/metadata-image', icon: ShieldOff, desc: 'Clean EXIF data' },
  { name: 'Pixelate', path: '/pixelate-image', icon: Grid3X3, desc: 'Censor or stylize' },
  { name: 'Black/White', path: '/blackwhite-image', icon: Contrast, desc: 'Grayscale & binary' },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    router.push('/');
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  };

  const activeTool = NAV_ITEMS.find(item => item.path === pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={handleLogoClick}>
          <div className="w-12 h-12 brand-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Aperture className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter gradient-text">
            ImageToolLab
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                isToolsOpen || activeTool
                  ? "bg-slate-900 text-white shadow-xl"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Tools
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", isToolsOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-4 w-[600px] bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-8 grid grid-cols-2 gap-4"
                >
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsToolsOpen(false)}
                      className={cn(
                        "flex items-center gap-5 p-5 rounded-3xl transition-all duration-300 group",
                        pathname === item.path ? "bg-slate-50 border border-slate-100" : "hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                        pathname === item.path ? "bg-slate-900 shadow-sm" : "bg-slate-100 group-hover:bg-slate-900 group-hover:shadow-sm"
                      )}>
                        <item.icon className={cn("w-6 h-6", pathname === item.path ? "text-white" : "text-slate-600 group-hover:text-white")} />
                      </div>
                      <div>
                        <div className={cn("text-sm font-black tracking-tight", pathname === item.path ? "text-slate-900" : "text-slate-700")}>{item.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors">Blog</Link>
          <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors">About</Link>
          <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-4 text-slate-900 bg-slate-100 border border-slate-200 rounded-2xl hover:bg-slate-200 transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white overflow-hidden"
          >
            <div className="p-6 grid grid-cols-2 gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all border border-transparent gap-3",
                    pathname === item.path
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-200"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="p-6 border-t border-slate-200 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 rounded-2xl">Blog</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 rounded-2xl">About</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 rounded-2xl">Contact</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
