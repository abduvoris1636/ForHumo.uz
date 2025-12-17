import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Snowfall from '@/components/Snowfall';
import { initializeAdmin } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Humo eSport - eSports Tournament Platform',
  description: 'O\'zbekistonning eng yirik eSport turnirlarini boshqarish platformasi',
};

// Initialize admin on server start
if (process.env.NODE_ENV === 'production') {
  initializeAdmin();
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className="scroll-smooth">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 min-h-screen text-white`}>
        <Snowfall />
        <div className="relative z-20">
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
