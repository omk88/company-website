"use client";

import { BlogCard, BlogPostPreview } from "./BlogCard";

interface BlogGridProps {
  initialPosts: BlogPostPreview[];
}

export function BlogGrid({ initialPosts }: BlogGridProps) {
  if (!initialPosts || initialPosts.length === 0) {
    return (
      <div className="w-full py-2 my-12 flex justify-center">
        <style>{`
          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <div 
          className="w-full max-w-md mx-auto text-center p-8 sm:p-12 border border-border/50 bg-card/70 backdrop-blur-md rounded-none shadow-md shadow-black/5 dark:shadow-black/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col items-center justify-center min-h-[250px]"
          style={{
            animation: `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            opacity: 0,
          }}
        >
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase bg-muted/30 px-3 py-1 border border-border/40">
              Status // Empty
            </span>
            <h3 className="text-xl font-semibold tracking-tight text-foreground pt-2">
              No Insights Found
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">
              No blog insights have been published to this section yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 my-6 w-full">
      {initialPosts.map((post, index) => (
        <BlogCard key={post._id} post={post} index={index} />
      ))}
    </div>
  );
}