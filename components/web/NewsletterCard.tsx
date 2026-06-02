import NewsletterSubscriptionForm from "./NewsletterSubscriptionForm";

export function NewsletterCard() {

    return (
        <div className="w-full bg-muted flex flex-col md:flex-row justify-between p-20 gap-8">
            <div className="flex-1 max-w-xl flex flex-col gap-4">
                <div>
                    <p className="text-lg text-muted-foreground uppercase tracking-wider mb-2">insights</p>
                    <h1 className="text-5xl font-bold leading-tight text-foreground">
                        Newsletter. Stay up to date.
                    </h1>
                </div>
                <NewsletterSubscriptionForm />
            </div>

            <div className="flex-1 max-w-sm md:pt-10"> 
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Subscribe to learn more about our latest insights, news and product launches
                </p>
            </div>
        </div>
    );
}