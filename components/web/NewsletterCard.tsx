import NewsletterSubscriptionForm from "./NewsletterSubscriptionForm";

export function NewsletterCard() {
  return (
    <div 
      className="relative w-full bg-card/70 backdrop-blur-md border border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 flex flex-col md:flex-row justify-between px-6 py-12 md:p-20 gap-8 overflow-hidden"
    >
      <div className="absolute right-[-10%] top-[-10%] w-[60%] h-[120%] pointer-events-none opacity-80 dark:opacity-40 hidden md:block select-none z-10 isolate will-change-transform transform translate-z-0" aria-hidden="true">
        <svg 
          viewBox="0 0 500 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full transform scale-110 origin-top-right"
        >
          <circle cx="380" cy="180" r="60" stroke="currentColor" className="text-muted-foreground/45" strokeWidth="1" />
          <circle cx="380" cy="180" r="90" stroke="currentColor" className="text-muted-foreground/40" strokeWidth="1" />
          <circle cx="380" cy="180" r="120" stroke="currentColor" className="text-muted-foreground/35" strokeWidth="1" />
          <circle cx="380" cy="180" r="150" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="1" />
          <circle cx="380" cy="180" r="185" stroke="currentColor" className="text-muted-foreground/25" strokeWidth="1" />
          <circle cx="380" cy="180" r="225" stroke="currentColor" className="text-muted-foreground/20" strokeWidth="1" />
          <circle cx="380" cy="180" r="270" stroke="currentColor" className="text-muted-foreground/15" strokeWidth="1" />
          <circle cx="380" cy="180" r="320" stroke="currentColor" className="text-muted-foreground/10" strokeWidth="1" />
          <circle cx="380" cy="180" r="375" stroke="currentColor" className="text-muted-foreground/8" strokeWidth="1" />
          <circle cx="380" cy="180" r="435" stroke="currentColor" className="text-muted-foreground/5" strokeWidth="1" />
          <circle cx="380" cy="180" r="500" stroke="currentColor" className="text-muted-foreground/5" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-20 w-full md:flex-1 max-w-xl flex flex-col gap-4">
        <div>
          <p className="text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">
            insights // newsletter
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-none">
            Newsletter.
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-muted-foreground/80 mt-1">
            Stay up to date.
          </h2>
        </div>
        <div className="max-w-md pt-2">
          <NewsletterSubscriptionForm />
        </div>
      </div>

      <div className="relative z-20 w-full md:flex-1 max-w-sm md:pt-12 lg:pt-14"> 
        <p className="text-sm md:text-base font-mono leading-relaxed text-muted-foreground">
          Subscribe to learn more about our latest insights, news and product launches.
        </p>
      </div>
      
    </div>
  );
}