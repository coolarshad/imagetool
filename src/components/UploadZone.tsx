import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, FileText, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.tiff', '.bmp']
    },
    multiple: false
  } as any);

  return (
    <div className="max-w-5xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer transition-all duration-700",
          "border-2 border-dashed rounded-[3rem] p-16 md:p-32",
          "flex flex-col items-center justify-center text-center gap-10",
          "bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]",
          isDragActive 
            ? "border-emerald-500 bg-emerald-50 scale-[1.02] shadow-2xl shadow-emerald-500/10" 
            : "border-slate-200 hover:border-emerald-500/50 hover:bg-slate-50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className={cn(
          "w-28 h-28 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl shadow-emerald-500/10",
          isDragActive ? "brand-gradient scale-110" : "bg-slate-50 border border-slate-100 group-hover:scale-110"
        )}>
          <Upload className={cn(
            "w-12 h-12 transition-all duration-700",
            isDragActive ? "text-white rotate-0" : "text-slate-400 group-hover:text-emerald-500 -rotate-12 group-hover:rotate-0"
          )} />
        </div>

        <div className="space-y-4">
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {isDragActive ? "Release to start" : "Drop your masterpiece"}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto text-lg font-medium leading-relaxed">
            Drag and drop your high-resolution assets here, or click to browse from your device.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 pt-12 border-t border-slate-100 w-full max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            100% Private
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
            </div>
            All Formats
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
            <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-teal-500" />
            </div>
            No Limits
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Resize", desc: "Change dimensions with pixel-perfect precision.", icon: "📏" },
          { title: "Crop", desc: "Focus on what matters with intuitive framing.", icon: "✂️" },
          { title: "Convert", desc: "Switch between formats instantly and securely.", icon: "🔄" }
        ].map((feature, i) => (
          <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-200 hover:border-emerald-500/30 transition-all hover:-translate-y-2 group shadow-sm hover:shadow-xl">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
            <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h4>
            <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
