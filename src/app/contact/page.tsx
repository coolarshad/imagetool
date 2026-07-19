import { Contact } from '@/components/CompanyPages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - ImageToolLab',
  description: 'Get in touch with the ImageToolLab team. We\'d love to hear your feedback, suggestions, or answer any questions you might have.',
  alternates: { canonical: '/contact/' }
};

export default function ContactPage() {
  return <Contact />;
}
