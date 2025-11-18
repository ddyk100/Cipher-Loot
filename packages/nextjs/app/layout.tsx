import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Cinzel } from 'next/font/google';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Cipher Loot — Encrypted Loot Box on Sepolia',
  description: 'Draw, decrypt, and verify FHE-powered loot on the Sepolia testnet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${playfairDisplay.variable} ${cinzel.variable} bg-black text-[#fffff0]`}>
        <Script src="https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs" strategy="beforeInteractive" />
        <div className="noise-overlay min-h-screen">{children}</div>
      </body>
    </html>
  );
}
