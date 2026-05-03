"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, FileText, Users, Globe, Zap, Lock, Heart } from 'lucide-react';
import { getPageContent, firebaseConfig } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';

const PageWrapper = ({ 
  children, 
  title, 
  icon: Icon,
  pageId,
  defaultSeoTitle,
  defaultSeoDesc
}: { 
  children: React.ReactNode, 
  title: string, 
  icon: any,
  pageId: string,
  defaultSeoTitle: string,
  defaultSeoDesc: string
}) => {
  const [cmsData, setCmsData] = useState<any>(null);

  useEffect(() => {
    async function fetchCms() {
      if (firebaseConfig.projectId === 'YOUR_PROJECT_ID') return;
      const data = await getPageContent(pageId);
      setCmsData(data);
    }
    fetchCms();
  }, [pageId]);

  const displayTitle = cmsData?.title || title;

  return (
    <>
      
      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8 rounded-lg shadow-sm border border-yellow-200 max-w-4xl mx-auto mt-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto py-20 px-6"
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 brand-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            {displayTitle}
          </h1>
        </div>
        <div className="prose max-w-none text-slate-600 leading-relaxed space-y-10 font-medium text-lg">
          {cmsData?.body ? (
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-3xl font-black text-slate-900 tracking-tight" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2" {...props} />,
                a: ({node, ...props}) => <a className="text-emerald-500 hover:text-emerald-600 underline underline-offset-4" {...props} />
              }}
            >
              {cmsData.body}
            </ReactMarkdown>
          ) : (
            children
          )}
        </div>
      </motion.div>
    </>
  );
};

export const About = () => (
  <PageWrapper 
    title="About ImageToolLab" 
    icon={Users} 
    pageId="about"
    defaultSeoTitle="About Us"
    defaultSeoDesc="Learn more about ImageToolLab's mission to provide fast, secure, and completely private browser-based image editing tools."
  >
    <section className="space-y-6">
      <p className="text-xl text-slate-600 font-bold leading-relaxed">
        ImageToolLab was born out of a simple observation: most online image editing tools are either too complex, 
        filled with intrusive ads, or compromise user privacy by uploading sensitive data to remote servers.
      </p>
      <p className="text-slate-600">
        We decided to build a better alternative. A tool that is powerful yet simple, beautiful yet functional, 
        and most importantly, 100% private.
      </p>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
      <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl hover:bg-slate-50 transition-all group">
        <Zap className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform fill-emerald-500/10" />
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Blazing Fast</h3>
        <p className="text-slate-600 leading-relaxed">By leveraging modern browser APIs and hardware acceleration, we process your images instantly right on your device.</p>
      </div>
      <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl hover:bg-slate-50 transition-all group">
        <Lock className="w-10 h-10 text-teal-500 mb-6 group-hover:scale-110 transition-transform fill-teal-500/10" />
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Privacy First</h3>
        <p className="text-slate-600 leading-relaxed">Your images never leave your computer. We don't have servers that store your data, because we don't need them.</p>
      </div>
    </div>

    <section className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Mission</h2>
      <p className="text-slate-600">
        Our mission is to democratize high-quality image editing. We believe that everyone should have access to 
        professional-grade tools without having to worry about their privacy or paying expensive subscriptions.
      </p>
    </section>
  </PageWrapper>
);

export const Privacy = () => (
  <PageWrapper 
    title="Privacy Policy" 
    icon={Shield} 
    pageId="privacy"
    defaultSeoTitle="Privacy Policy"
    defaultSeoDesc="Read the ImageToolLab Privacy Policy. Discover how we protect your data by processing images entirely inside your browser without external servers."
  >
    <section className="space-y-6">
      <p className="text-sm font-black uppercase tracking-widest text-emerald-500">Last updated: April 12, 2026</p>
      <p className="text-xl text-slate-600 font-bold leading-relaxed">
        At ImageToolLab, your privacy is not just a feature—it's our core philosophy. 
        Because our application runs entirely in your web browser, we do not collect, 
        store, or transmit any of the images you edit.
      </p>
    </section>

    <section className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">1. Data Collection</h2>
      <p className="text-slate-600">
        We do not collect any personally identifiable information (PII). We do not use tracking cookies 
        to follow you across the web. The only data we might see is anonymous, aggregated usage statistics 
        (like which tools are most popular) to help us improve the app.
      </p>
    </section>

    <section className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">2. Image Processing</h2>
      <p className="text-slate-600">
        All image processing is performed locally on your device using JavaScript and the Canvas API. 
        When you "upload" an image, it is simply loaded into your browser's memory. It is never sent 
        to our servers or any third-party service.
      </p>
    </section>

    <section className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">3. Third-Party Services</h2>
      <p className="text-slate-600">
        We may use third-party CDNs to serve our application's code and assets. These providers 
        may log your IP address as part of standard web server logs, but they do not have access 
        to the data you process within the app.
      </p>
    </section>
  </PageWrapper>
);

export const Terms = () => (
  <PageWrapper 
    title="Terms of Service" 
    icon={FileText} 
    pageId="terms"
    defaultSeoTitle="Terms of Service"
    defaultSeoDesc="Review the Terms of Service for using ImageToolLab."
  >
    <section className="space-y-6">
      <p className="text-xl text-slate-600 font-bold leading-relaxed">
        By using ImageToolLab, you agree to the following terms. Please read them carefully.
      </p>
    </section>

    <section className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">1. Use of Service</h2>
      <p className="text-slate-600">
        ImageToolLab is provided "as is" and "as available". You are free to use our tools for 
        personal or commercial purposes. You are responsible for ensuring you have the rights 
        to the images you edit.
      </p>
    </section>

    <section className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">2. Prohibited Activities</h2>
      <p className="text-slate-600">
        You may not use ImageToolLab to process illegal content or engage in activities that 
        violate the rights of others. Since processing happens on your device, you are 
        solely responsible for your actions.
      </p>
    </section>

    <section className="space-y-6">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">3. Limitation of Liability</h2>
      <p className="text-slate-600">
        ImageToolLab and its creators shall not be liable for any damages arising from the 
        use or inability to use our services, including but not limited to data loss or 
        image corruption.
      </p>
    </section>
  </PageWrapper>
);

export const Contact = () => (
  <PageWrapper 
    title="Contact Us" 
    icon={Mail} 
    pageId="contact"
    defaultSeoTitle="Contact Us"
    defaultSeoDesc="Get in touch with the ImageToolLab team. Reach out via email or connect with us on social media for support and feedback."
  >
    <section className="space-y-6">
      <p className="text-xl text-slate-600 font-bold leading-relaxed">
        Have a question, feedback, or a feature request? We'd love to hear from you! 
        Since ImageToolLab is a community-driven project, your input is invaluable.
      </p>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
      <a href="mailto:hello@imagetoollab.com" className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl hover:bg-slate-50 transition-all group">
        <Mail className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform fill-emerald-500/10" />
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Email Us</h3>
        <p className="text-slate-600 font-medium">General inquiries and support</p>
        <p className="mt-6 text-slate-900 font-black tracking-tight text-lg underline decoration-emerald-500 underline-offset-8">hello@imagetoollab.com</p>
      </a>
      <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl hover:bg-slate-50 transition-all group">
        <Globe className="w-10 h-10 text-teal-500 mb-6 group-hover:scale-110 transition-transform fill-teal-500/10" />
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Social</h3>
        <p className="text-slate-600 font-medium">Follow us for updates</p>
        <div className="mt-6 flex gap-6">
          <span className="text-slate-900 font-black cursor-pointer hover:text-emerald-500 transition-colors">Twitter</span>
          <span className="text-slate-900 font-black cursor-pointer hover:text-emerald-500 transition-colors">GitHub</span>
        </div>
      </div>
    </div>

    <section className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl">
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Open Source</h3>
      <p className="text-slate-600 leading-relaxed font-medium">
        ImageToolLab is an open-source project. If you're a developer and want to contribute 
        or report a bug, please visit our GitHub repository.
      </p>
    </section>
  </PageWrapper>
);
