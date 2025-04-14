import './globals.css';

import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { metadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export { metadata };

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
} 