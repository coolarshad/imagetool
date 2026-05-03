import { Terms } from '@/components/CompanyPages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - ImageToolLab',
  description: 'Review the Terms of Service for using ImageToolLab.'
};

export default function TermsPage() {
  return <Terms />;
}
