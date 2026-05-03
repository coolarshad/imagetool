import { Privacy } from '@/components/CompanyPages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ImageToolLab',
  description: 'Read the ImageToolLab Privacy Policy. Discover how we protect your data by processing images entirely inside your browser without external servers.'
};

export default function PrivacyPage() {
  return <Privacy />;
}
