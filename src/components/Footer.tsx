import React from 'react';
import { Aperture, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-16 mt-auto relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-4 mb-10 group">
              <div className="w-14 h-14 brand-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Aperture className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-black tracking-tighter gradient-text">ImageToolLab</span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed text-lg font-medium">
              The ultimate online image editor. Fast, secure, and free. 
              All processing happens locally in your browser, ensuring your privacy is never compromised.
            </p>
          </div>
          
          <div className="md:col-span-4">
            <h4 className="text-slate-900 font-black mb-10 uppercase tracking-[0.3em] text-[10px]">Tools</h4>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-5 text-sm text-slate-500 font-bold">
              <li><Link href="/resize-image" className="hover:text-slate-900 transition-colors">Resize Image</Link></li>
              <li><Link href="/crop-image" className="hover:text-slate-900 transition-colors">Crop Image</Link></li>
              <li><Link href="/mirror-image" className="hover:text-slate-900 transition-colors">Mirror Image</Link></li>
              <li><Link href="/rotate-image" className="hover:text-slate-900 transition-colors">Rotate Image</Link></li>
              <li><Link href="/compress-image" className="hover:text-slate-900 transition-colors">Compress Image</Link></li>
              <li><Link href="/convert-image" className="hover:text-slate-900 transition-colors">Convert Image</Link></li>
              <li><Link href="/watermark-image" className="hover:text-slate-900 transition-colors">Watermark</Link></li>
              <li><Link href="/metadata-image" className="hover:text-slate-900 transition-colors">Clean Metadata</Link></li>
              <li><Link href="/pixelate-image" className="hover:text-slate-900 transition-colors">Pixelate Image</Link></li>
              <li><Link href="/blackwhite-image" className="hover:text-slate-900 transition-colors">Black/White</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-slate-900 font-black mb-10 uppercase tracking-[0.3em] text-[10px]">Company</h4>
            <ul className="space-y-5 text-sm text-slate-500 font-bold">
              <li><Link href="/blog" className="hover:text-slate-900 transition-colors">Blog & Media</Link></li>
              <li><Link href="/about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-10 text-sm text-slate-400 font-bold">
          <p>© 2026 ImageToolLab. Built for the modern web.</p>
          <div className="flex items-center gap-4 px-8 py-4 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm">
            Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> for creators
          </div>
        </div>
      </div>
    </footer>
  );
}
