'use client'

import { BlogCard, BlogPostPreview } from './BlogCard'

interface FeaturedBlogMarqueeProps {
  posts: BlogPostPreview[]
}

export default function FeaturedBlogMarquee({ posts }: FeaturedBlogMarqueeProps) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="w-full py-6 relative z-10 box-border">
      <style>{`
        @keyframes blogMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-blog-marquee {
          animation: blogMarquee 65s linear infinite;
        }
        .animate-blog-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative w-full overflow-hidden">
        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 text-left mb-6 space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Featured
            </h2>
        </div>

        <div className="relative w-full overflow-hidden py-2">
          
          <div className="flex w-max items-stretch gap-6 pr-6 animate-blog-marquee">
            
            {posts.map((post, idx) => (
              <div 
                key={`original-${post._id}-${idx}`} 
                className="w-[320px] sm:w-[400px] shrink-0 flex"
              >
                <BlogCard post={post} index={idx} />
              </div>
            ))}

            {posts.map((post, idx) => (
              <div 
                key={`duplicate-${post._id}-${idx}`} 
                className="w-[320px] sm:w-[400px] shrink-0 flex"
              >
                <BlogCard post={post} index={idx} />
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}