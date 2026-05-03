import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://imagetoollab.com'),
  title: 'ImageToolLab - Free Online Image Editor',
  description: 'The ultimate online image editor. Fast, secure, and free. All processing happens locally in your browser, ensuring your privacy is never compromised.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-x-hidden">
        {/* Global Mesh Gradient Background */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
        </div>
        
        <Header />
        
        <main className="container mx-auto px-6 py-8 md:py-12 flex-1 relative z-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
