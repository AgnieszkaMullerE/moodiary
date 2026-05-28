import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import BottomNav from '@/components/BottomNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Moodiary',
  description: 'Prywatny dziennik osobisty',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-[#FAF7F2] overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="mx-auto max-w-[430px] h-full flex flex-col">
            <main className="flex-1 overflow-y-auto">{children}</main>
            <BottomNav />
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
