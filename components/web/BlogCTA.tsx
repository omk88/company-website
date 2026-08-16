import NewsletterSubscriptionForm from "./NewsletterSubscriptionForm";

export function BlogCTA() {
  return (
    <div className="my-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="space-y-1 max-w-md">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Stay in the loop
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Get notified when we publish new articles and product updates.
        </p>
      </div>

      <div className="w-full sm:w-auto shrink-0">
        <NewsletterSubscriptionForm />
      </div>
    </div>
  );
}