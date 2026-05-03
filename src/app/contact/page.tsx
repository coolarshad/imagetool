import { Contact } from '@/components/CompanyPages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - ImageToolLab',
  description: 'Get in touch with the ImageToolLab team. Reach out via email or connect with us on social media for support and feedback.'
};

export default function ContactPage() {
  return <Contact />;
}
