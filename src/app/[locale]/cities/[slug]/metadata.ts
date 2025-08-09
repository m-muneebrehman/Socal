import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

async function readCity(locale: string, slug: string) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cities', locale, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const city = (await readCity(params.locale, params.slug)) || (await readCity('en', params.slug))

  if (!city) return {}

  const title = city.seo?.metaTitle || `${city.name} Real Estate & Lifestyle Guide - Luxury Living in ${city.name}`
  const description = city.seo?.metaDescription || `Explore luxury real estate, top neighborhoods, and cultural highlights in ${city.name}.`
  const ogImage = city.seo?.ogImage || city.heroImage
  const ogImageAlt = city.seo?.ogImageAlt || `${city.name} city skyline`
  const canonical = `${siteUrl}/${params.locale}/cities/${params.slug}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/cities/${params.slug}`,
        de: `${siteUrl}/de/cities/${params.slug}`,
        fr: `${siteUrl}/fr/cities/${params.slug}`,
        zh: `${siteUrl}/zh/cities/${params.slug}`,
        ar: `${siteUrl}/ar/cities/${params.slug}`,
        es: `${siteUrl}/es/cities/${params.slug}`,
      },
    },
    robots: { index: true, follow: true },
    keywords: city.seo?.keywords?.split(',').map((s: string) => s.trim()).filter(Boolean),
    openGraph: {
      type: 'website',
      url: canonical,
      title: city.seo?.ogTitle || title,
      description: city.seo?.ogDescription || description,
      siteName: 'SoCal Real Estate',
      locale: params.locale,
      images: ogImage ? [{ url: ogImage, alt: ogImageAlt, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: (city.seo?.twitterCard as any) || 'summary_large_image',
      title: city.seo?.ogTitle || title,
      description: city.seo?.ogDescription || description,
      images: ogImage ? [ogImage] : undefined,
    },
    other: {
      'geo.region': `US-${city.state === 'California' ? 'CA' : city.state}`,
      'geo.placename': city.name,
    },
  }
}


