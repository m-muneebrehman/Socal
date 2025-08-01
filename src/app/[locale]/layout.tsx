import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/common/LoadingScreen'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'de','fr','zh','ar','es'];

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}



export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white text-charcoal">
      <NextIntlClientProvider messages={messages}>
        <LoadingScreen />
        <Navigation />
        {children}
        <Footer/>
      </NextIntlClientProvider>
      </body>
    </html>
  )
}