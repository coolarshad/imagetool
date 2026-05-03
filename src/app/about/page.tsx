import { About } from '@/components/CompanyPages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - ImageToolLab',
  description: 'Learn more about ImageToolLab\'s mission to provide fast, secure, and completely private browser-based image editing tools.'
};

export default function AboutPage() {
  return <About />;
}
