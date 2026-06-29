'use client'

import { Star } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BlogCard, BlogPostPreview } from './BlogCard'

interface FeaturedBlogMarqueeProps {
  posts: BlogPostPreview[]
}

export default function FeaturedBlogMarquee({ posts }: FeaturedBlogMarqueeProps) {
  if (!posts || posts.length === 0) return null

  const [heroPost, ...marqueePosts] = posts

  const formattedHeroDate = new Date(heroPost.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

  return (
    <div className="w-full relative z-10 box-border space-y-12">
      <style>{`
        @keyframes blogMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-blog-marquee {
          animation: blogMarquee 65s linear infinite;
        }
        .animate-blog-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
        <h1 className="flex items-center justify-start gap-2 font-bold text-base md:text-lg text-muted-foreground tracking-tight">
          <Star className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
          <span>Featured</span>
        </h1>
        <Link 
          href={`/insights/${heroPost._id}`}
          className="group relative block w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden border border-border/50 bg-card/70 backdrop-blur-md shadow-xl transition-all duration-300"
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={heroPost.imageUrl}
              alt={heroPost.title}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent md:from-background/95 md:via-background/20" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col justify-end items-start gap-3 max-w-3xl z-10">
            <div className="flex flex-wrap gap-2">
              {heroPost.tags && heroPost.tags.length > 0 ? (
                heroPost.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">
                  General
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {heroPost.title}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground line-clamp-2 max-w-2xl hidden sm:block">
                {heroPost.subtitle}
              </p>
            </div>

            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground/90 mt-1">
              By {heroPost.author} • {formattedHeroDate}
            </div>
          </div>
        </Link>
      </div>

      {marqueePosts.length > 0 && (
        <div className="relative w-full overflow-hidden space-y-4">
          <div className="relative w-full overflow-hidden py-2">
            {/* Added items-stretch here to force unified row tracks */}
            <div className="flex w-max items-stretch gap-6 pr-6 animate-blog-marquee">
              
              {/* Loop 1: Original Set */}
              {marqueePosts.map((post, idx) => (
                <div 
                  key={`original-${post._id}-${idx}`} 
                  className="w-[320px] sm:w-[400px] min-w-[320px] sm:min-w-[400px] shrink-0 flex"
                >
                  <div className="w-full flex flex-col flex-1 items-stretch">
                    <BlogCard post={post} index={idx} />
                  </div>
                </div>
              ))}

              {/* Loop 2: Duplicate Set */}
              {marqueePosts.map((post, idx) => (
                <div 
                  key={`duplicate-${post._id}-${idx}`} 
                  className="w-[320px] sm:w-[400px] min-w-[320px] sm:min-w-[400px] shrink-0 flex"
                >
                  <div className="w-full flex flex-col flex-1 items-stretch">
                    <BlogCard post={post} index={idx} />
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}