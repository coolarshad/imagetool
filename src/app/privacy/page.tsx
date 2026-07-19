import { Privacy } from '@/components/CompanyPages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ImageToolLab',
  description: 'Read our privacy policy to understand how ImageToolLab completely protects your data by processing all images locally in your browser.',
  alternates: { canonical: '/privacy/' }
};

export default function PrivacyPage() {
  return <Privacy />;
}
