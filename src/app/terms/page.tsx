import { Terms } from '@/components/CompanyPages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - ImageToolLab',
  description: 'Read the terms of service for using ImageToolLab\'s free online image editing tools.',
  alternates: { canonical: '/terms/' }
};

export default function TermsPage() {
  return <Terms />;
}
