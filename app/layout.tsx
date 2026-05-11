import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LangToggle from '@/components/LangToggle';

export const metadata: Metadata = {
  title: 'StarSpeak | 星言',
  description: 'AI divination for entertainment | AI占卜娱乐',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-black text-white">
        <LanguageProvider>
          <LangToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}