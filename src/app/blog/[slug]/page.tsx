import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getArticleBySlug, firebaseConfig, getArticles } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  if (firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
    return [];
  }
  try {
    const articles = await getArticles();
    return articles.map((article: any) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for articles:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
    return { title: 'Article' };
  }
  const article: any = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  
  return {
    title: article.seoTitle || `${article.title} - ImageToolLab Blog`,
    description: article.seoDescription || article.excerpt
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <div className="bg-yellow-50 text-yellow-800 p-4 text-sm font-medium rounded-lg shadow-sm border border-yellow-200">
          Firebase is not connected. Connect Firebase to view articles.
        </div>
        <Link href="/blog" className="text-emerald-500 font-bold mt-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const article: any = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-6">
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-medium mb-10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <div>
        {article.imageUrl && (
          <div className="w-full h-[400px] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-emerald-500/10 border border-slate-100">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-wide uppercase text-sm mb-6">
          <Calendar className="w-4 h-4" />
          {new Date(article.publishedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>

        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-12 leading-tight">
          {article.title}
        </h1>

        <div className="prose max-w-none text-slate-600 leading-relaxed font-medium text-lg prose-emerald">
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-black text-slate-900 mt-8 mb-4 tracking-tight" {...props} />,
              p: ({node, ...props}) => <p className="mb-6" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-3 mb-6" {...props} />,
              li: ({node, ...props}) => <li className="text-slate-600" {...props} />,
              a: ({node, ...props}) => <a className="text-emerald-500 hover:text-emerald-600 underline underline-offset-4" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-6 italic bg-emerald-50/50 py-4 pr-4 rounded-r-2xl my-8 text-slate-700" {...props} />
            }}
          >
            {article.body}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
