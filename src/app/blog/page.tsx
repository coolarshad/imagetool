import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { getArticles, firebaseConfig } from '@/lib/firebase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog & Articles - ImageToolLab",
  description: "Read our latest articles, tutorials, and tips on image editing, web performance, and digital privacy."
};

export default async function BlogPage() {
  const isFirebaseUnconfigured = firebaseConfig.projectId === 'YOUR_PROJECT_ID';
  const articles = isFirebaseUnconfigured ? [] : await getArticles();

  return (
    <>
      {isFirebaseUnconfigured && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8 rounded-lg shadow-sm border border-yellow-200 max-w-4xl mx-auto mt-8">
          Firebase is not connected. Connect Firebase to see live articles.
        </div>
      )}

      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            Blog & Articles
          </h1>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
            Discover tutorials, tips, and insights about image processing, privacy, and web technology.
          </p>
        </div>

        {articles.length === 0 && !isFirebaseUnconfigured ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-lg font-medium">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any, index: number) => (
              <div
                key={article.id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all border border-slate-100 overflow-hidden flex flex-col"
              >
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-500 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-600 line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 text-emerald-500 font-bold group/link"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
