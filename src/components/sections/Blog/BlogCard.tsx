import React from 'react'
import Link from 'next/link'

type BlogCardProps = {
  date: string
  title: string
  excerpt: string
  imageUrl: string
}

const BlogCard = ({ date, title, excerpt, imageUrl }: BlogCardProps) => {
  return (
    <div className="bg-cream grid grid-cols-1 lg:grid-cols-2 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-400 ease-in-out">
      <div 
        className="h-80 lg:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="p-12 flex flex-col justify-center">
        <div className="text-xs text-gold uppercase tracking-wider mb-4">{date}</div>
        <h3 className="font-serif text-2xl md:text-3xl mb-5 leading-snug">{title}</h3>
        <p className="text-charcoal/80 leading-relaxed mb-6">{excerpt}</p>
        <Link 
          href="#" 
          className="text-sm uppercase tracking-wider font-medium inline-flex items-center gap-2 hover:text-gold transition-all duration-300"
        >
          Read Article
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  )
}

export default BlogCard