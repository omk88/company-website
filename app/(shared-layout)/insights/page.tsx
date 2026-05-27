import { NewsletterCard } from "@/components/web/NewsletterCard";
import { TagFilters } from "@/components/web/TagFilters";

export default function InsightsPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <NewsletterCard />

            <TagFilters />
        </main>
    );
}