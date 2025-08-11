import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import AdminAwareLayout from '@/components/layout/AdminAwareLayout';
import { Toaster } from 'sonner';

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
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale as string)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="font-sans bg-white text-charcoal">
        <NextIntlClientProvider messages={messages}>
          <AdminAwareLayout>{children}</AdminAwareLayout>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}